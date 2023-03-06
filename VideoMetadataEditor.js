let getMediaDuration = async file => new Promise((resolve, reject) => {
  const video = document.createElement('video')
  video.preload = 'metadata'
  video.onloadedmetadata = () => {
    URL.revokeObjectURL(video.src)
    const duration = video.duration
    if (isNaN(duration)) {
      reject('Unable to retrieve media duration.')
    } else {
      resolve(duration)
    }
  }
  video.src = URL.createObjectURL(file)
})

export class VideoMetadataEditor extends HTMLElement {
  constructor() {
    super()

    // Create form elements
    const form = document.createElement("form")
    form.classList.add('metadata-form')

    const dropzone = document.createElement("div")
    dropzone.classList.add("dropzone")

    const fileInput = document.createElement("input")
    const fileName = document.createElement("input")
    const title = document.createElement("input")
    const duration = document.createElement("input")
    const fileSize = document.createElement("input")
    const customFields = document.createElement("div")

    const addButton = document.createElement("button")

    

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault()
      dropzone.classList.add("dragover")
    })

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover")
    })

    dropzone.addEventListener("drop", async (e) => {
      e.preventDefault()
      dropzone.classList.remove("dragover")
      const file = e.dataTransfer.files[0]
      fileInput.files = e.dataTransfer.files
      fileName.value = file.name
      duration.value = await getMediaDuration(file)
      fileSize.value = file.size
    })

    fileInput.setAttribute("type", "file")
    fileInput.setAttribute("accept", "video/*")
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0]
      fileName.value = file.name
      duration.value = file.duration
      fileSize.value = file.size
    })

    fileName.setAttribute("type", "text")
    fileName.setAttribute("placeholder", "File Name")

    title.setAttribute("type", "text")
    title.setAttribute("placeholder", "Title")

    duration.setAttribute("type", "text")
    // duration.setAttribute("readonly", true)
    duration.setAttribute("placeholder", "Duration")

    fileSize.setAttribute("type", "text")
    // fileSize.setAttribute("readonly", true)
    fileSize.setAttribute("placeholder", "File Size")

    customFields.classList.add("custom-fields")

    addButton.setAttribute("type", "button")
    addButton.textContent = "Add Metadata Field"
    addButton.addEventListener("click", () => {
      const field = document.createElement("input")
      field.setAttribute("type", "text")
      field.setAttribute("placeholder", "Custom Field")
      customFields.appendChild(field)
    })

    // Add form elements to form
    dropzone.appendChild(fileInput)
    form.appendChild(dropzone)
    form.appendChild(fileName)
    form.appendChild(title)
    form.appendChild(duration)
    form.appendChild(fileSize)
    form.appendChild(customFields)
    form.appendChild(addButton)

    this.append(form)

    this.listen()
  }

  set data(data){
  }

  get data(){
    return Object.fromEntries(new FormData(this.querySelector('form')))
  }

  render() {
  }

  listen() {
    this.addEventListener("click", (clickEvent) => {
    })
  }
}


customElements.define('video-metadata-editor', VideoMetadataEditor)