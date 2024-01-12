class ImageEditor {
  constructor() {
    this.fileInput = document.querySelector(".file-input");
    this.filterOptions = document.querySelector(".filter");
    this.rotateOptions = document.querySelectorAll(".rotate button");
    this.previewImg = document.querySelector(".preview-img img");
    this.resetFilterBtn = document.querySelector(".reset-filter");
    this.chooseImgBtn = document.querySelector(".choose-img");
    this.saveImgBtn = document.querySelector(".save-img");
    this.filterSlider = document.querySelector(".slider input");
    this.filterName = document.querySelector(".filter-info .name");
    this.filterValue = document.querySelector(".filter-info .value");

    this.brightness = 100;
    this.saturation = 100;
    this.inversion = 0;
    this.grayscale = 0;
    this.rotate = 0;
    this.flipHorizontal = 1;
    this.flipVertical = 1;

    this.init();
  }

  init() {
    this.fileInput.addEventListener("change", this.loadImage.bind(this));

    this.filterOptions = Array.from(
      document.querySelectorAll(".filter button")
    );
    this.rotateOptions = Array.from(
      document.querySelectorAll(".rotate button")
    );

    // Using forEach to add event listeners to each button
    this.filterOptions.forEach((button) => {
      button.addEventListener("click", this.handleFilterClick.bind(this));
    });

    this.rotateOptions.forEach((button) => {
      button.addEventListener("click", this.handleRotateClick.bind(this));
    });

    this.filterSlider.addEventListener("input", this.updateFilter.bind(this));
    this.resetFilterBtn.addEventListener("click", this.resetFilter.bind(this));
    this.saveImgBtn.addEventListener("click", this.saveImage.bind(this));
    this.chooseImgBtn.addEventListener("click", () => this.fileInput.click());
  }

  loadImage() {
    let file = this.fileInput.files[0];
    if (!file) return;
    this.previewImg.src = URL.createObjectURL(file);
    this.previewImg.addEventListener("load", () => {
      this.resetFilterBtn.click();
      document.querySelector(".container").classList.remove("disable");
    });
  }

  handleFilterClick(event) {
    const option = event.target.closest("button");
    if (!option) return;
    document.querySelector(".active").classList.remove("active");
    option.classList.add("active");
    this.filterName.innerText = option.innerText;

    const filterId = option.id;
    if (filterId === "brightness" || filterId === "saturation") {
      this.filterSlider.max = "200";
      this.filterSlider.value = this[filterId];
      this.filterValue.innerText = `${this[filterId]}%`;
    } else {
      this.filterSlider.max = "100";
      this.filterSlider.value = this[filterId];
      this.filterValue.innerText = `${this[filterId]}%`;
    }
  }

  updateFilter() {
    this.filterValue.innerText = `${this.filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");
    const filterId = selectedFilter.id;
    this[filterId] = this.filterSlider.value;

    this.applyFilter();
  }

  handleRotateClick(event) {
    const optionId = event.target.closest("button");
    if (!optionId) return;
    if (optionId.id === "left") {
      this.rotate -= 90;
    } else if (optionId.id === "right") {
      this.rotate += 90;
    } else if (optionId.id === "horizontal") {
      this.flipHorizontal = this.flipHorizontal === 1 ? -1 : 1;
    } else {
      this.flipVertical = this.flipVertical === 1 ? -1 : 1;
    }

    this.applyFilter();
  }

  applyFilter() {
    this.previewImg.style.transform = `rotate(${this.rotate}deg) scale(${this.flipHorizontal}, ${this.flipVertical})`;
    this.previewImg.style.filter = `brightness(${this.brightness}%) saturate(${this.saturation}%) invert(${this.inversion}%) grayscale(${this.grayscale}%)`;
  }

  resetFilter() {
    this.brightness = 100;
    this.saturation = 100;
    this.inversion = 0;
    this.grayscale = 0;
    this.rotate = 0;
    this.flipHorizontal = 1;
    this.flipVertical = 1;
    this.filterOptions = document.querySelector("#reset").click();

    this.applyFilter();
  }

  saveImage() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = this.previewImg.naturalWidth;
    canvas.height = this.previewImg.naturalHeight;

    ctx.filter = `brightness(${this.brightness}%) saturate(${this.saturation}%) invert(${this.inversion}%) grayscale(${this.grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (this.rotate !== 0) {
      ctx.rotate((this.rotate * Math.PI) / 180);
    }
    ctx.scale(this.flipHorizontal, this.flipVertical);
    ctx.drawImage(
      this.previewImg,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
  }
}

// Instantiate the ImageEditor class
const imageEditor = new ImageEditor();
