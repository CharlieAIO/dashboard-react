window.addEventListener('click', (event) => {
    if(event.target.id.includes('hide')) {

    }else{

      var arr = document.getElementsByTagName('div')
      for(var i = 0; i < arr.length; i++) {
        if(arr[i].id.includes('hide')) {}
        if(arr[i].id.includes('dropdown')){
          arr[i].classList.add('hidden')
          arr[i].classList.remove('flex')
        }
      }

    }
})
  