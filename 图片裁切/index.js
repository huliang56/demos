window.onload = function() {
  var options = {
    imageBox: '.image-box',
    thumbBox: '.image-view-box',
    imgSrc: 'user.png'
  };
  var cropper = new cropbox(options);
  document.querySelector('#uploadFileBtn').addEventListener('change', function() {
    var reader = new FileReader();
    reader.onload = function(e) {
      options.imgSrc = e.target.result;
      cropper = new cropbox(options);
    };
    reader.readAsDataURL(this.files[0]);
    this.files.length = 0;
  });
  document.querySelector('#cropBtn').addEventListener('click', function() {
    var img = cropper.getDataURL();
    document.querySelector('.cropped-container').innerHTML += '<img src="' + img + '">';
  });
  document.querySelector('#zoomInBtn').addEventListener('click', function() {
    cropper.zoomIn();
  });
  document.querySelector('#zoomOutBtn').addEventListener('click', function() {
    cropper.zoomOut();
  });
};
