export const transformToLineChartData = (data: any) => {
  if (!data || !data.labels || !data.datasets) return []

  const transformedData: any[] = []
  data.labels.forEach((label: any, index: number) => {
    const dataPoint: any = { name: label }
    data.datasets.forEach((dataset: any) => {
      dataPoint[dataset.label] = dataset.data[index]
    })
    transformedData.push(dataPoint)
  })

  return transformedData
}

export const transformToBarChartData = (data: any) => {
  if (!data || !data.labels || !data.datasets) return []

  const transformedData: any[] = []
  data.labels.forEach((label: any, index: number) => {
    const dataPoint: any = { name: label }
    data.datasets.forEach((dataset: any) => {
      dataPoint[dataset.label] = dataset.data[index]
    })
    transformedData.push(dataPoint)
  })

  return transformedData
}

export const transformToPieChartData = (data: any) => {
  if (!data || !data.labels || !data.datasets || !data.datasets[0].data) return []

  return data.labels.map((label: any, index: number) => ({
    name: label,
    value: data.datasets[0].data[index],
    fill: data.datasets[0].backgroundColor[index],
  }))
}
