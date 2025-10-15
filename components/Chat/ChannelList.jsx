"use client"

import React from "react"
import { useChat } from "@/context/ChatContext"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Hash, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const ChannelList = () => {
  const { channels, currentChannel, setCurrentChannel, createChannel } = useChat()
  const [isCreatingChannel, setIsCreatingChannel] = React.useState(false)
  const [newChannelName, setNewChannelName] = React.useState("")
  const [newChannelDescription, setNewChannelDescription] = React.useState("")

  const handleCreateChannel = (e) => {
    e.preventDefault()
    if (newChannelName.trim()) {
      createChannel({
        name: newChannelName.trim(),
        description: newChannelDescription.trim(),
      })
      setNewChannelName("")
      setNewChannelDescription("")
      setIsCreatingChannel(false)
    }
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-4 mb-2">
        <h3 className="text-sm font-semibold">Channels</h3>
        <Dialog open={isCreatingChannel} onOpenChange={setIsCreatingChannel}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Channel</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new channel</DialogTitle>
              <DialogDescription>Add a new channel to discuss specific topics</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateChannel}>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Channel Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. react-help"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What's this channel about?"
                    value={newChannelDescription}
                    onChange={(e) => setNewChannelDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreatingChannel(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Channel</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-1 px-1">
          {channels.map((channel) => (
            <TooltipProvider key={channel.id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentChannel?.id === channel.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm px-2"
                    onClick={() => setCurrentChannel(channel)}
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    {channel.name}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{channel.description || `#${channel.name}`}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default ChannelList
