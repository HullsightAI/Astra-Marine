export async function readDocFile(file) {
  const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf')
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    if (isPDF) {
      reader.onload = e => resolve({ content: e.target.result.split(',')[1], isPDF: true })
      reader.readAsDataURL(file)
    } else {
      reader.onload = e => resolve({ content: e.target.result, isPDF: false })
      reader.readAsText(file)
    }
    reader.onerror = reject
  })
}

export async function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function genId(prefix = 'item') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function genReviewId(prefix = 'AMWS') {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`
}
