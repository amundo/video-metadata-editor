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

    this.innerHTML = `
      <form class=metadata-form>
        <label>Load file: <input type=file accept="video/*,audio/*"> <em>Or drop a file here.</em></label>
        
        <label>Title
          <input name="video-title" type="text"  placeholder="Video title">
        </label>

        <label>File name
          <input name="file-name" type="text"  placeholder="File name">
        </label>

        <label>File name
          <input name="file-name" type="text"  placeholder="File name">
        </label>

        <label>Duration
          <input name="duration" type="text"  placeholder="Duration (seconds)">
        </label>

        <label>File size
          <input name="file-size" type="number"  placeholder="File size (bytes)">
        </label>


        <div class=custom-fields>
          <button class=add-custom-field-button>+</button>
          <fieldset></fieldset>
        </div>
      
      </form>
    `


    this.form = this.querySelector("form")

    this.dropzone = document.createElement("div")
    this.dropzone.classList.add("dropzone")

    this.fileInput      = this.querySelector("input[type=file]")
    this.fileName       = this.querySelector("input[name=file-name]")
    this.videoTitle     = this.querySelector("input[name=video-title]")
    this.duration       = this.querySelector("input[name=duration]")
    this.fileSize       = this.querySelector("input[name=file-size]")
    this.customFields   = this.querySelector("div.custom-fields")

    this.addButton = this.querySelector(".add-custom-field-button")

    
    this.fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0]
      this.fileName.value = file.name
      this.duration.value = file.duration
      this.fileSize.value = file.size
    })

    this.addButton.addEventListener("click", () => {
      const field = document.createElement("input")
      let label = document.createElement('label')

      field.setAttribute("type", "text")
      field.setAttribute("placeholder", "Custom Field")
      this.customFields.appendChild(field)
    })

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
    this.dropzone.addEventListener("dragover", (e) => {
      e.preventDefault()
      this.dropzone.classList.add("dragover")
    })

    this.dropzone.addEventListener("dragleave", () => {
      this.dropzone.classList.remove("dragover")
    })

    this.dropzone.addEventListener("drop", async (e) => {
      e.preventDefault()
      this.dropzone.classList.remove("dragover")

      const file = e.dataTransfer.files[0]

      this.fileInput.files = e.dataTransfer.files
      this.fileName.value = file.name
      let duration = await getMediaDuration(file)
      this.duration.value = duration
      this.fileSize.value = file.size
    })

  }
}


customElements.define('video-metadata-editor', VideoMetadataEditor)