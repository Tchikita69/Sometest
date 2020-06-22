var ipc = require('electron').ipcRenderer


// function to set a given theme/color-scheme
function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
// function toggleTheme() {
//     if (localStorage.getItem('theme') === 'theme-dark') {
//         setTheme('theme-light');
//     } else {
//         setTheme('theme-dark');
//     }
// }

// Immediately invoked function to set the theme on initial load
(function () {
  // if (localStorage.getItem('theme') === 'theme-dark') {
  //     setTheme('theme-dark');
  //     document.getElementById('slider').checked = false;
  // } else {
  //     setTheme('theme-light');
  //   document.getElementById('slider').checked = true;
  // }
  setTheme(localStorage.getItem('theme'));
})();


// Flag to check if the 3 theme btns are out or not
var flag = 0;

// Functions handling clicks on theme selectors
var themeSelector = document.getElementById("theme-selector")
themeSelector.addEventListener("click", function (e) {
    if (flag == 0) {
    $(this).siblings('.dark').animate({
      bottom: '50px',
      left: '88%',
    }, 200);
    
    $(this).siblings('.light').delay(200).animate({
      bottom: '120px',
      left: '90%'
    }, 200);
    
    $(this).siblings('.colors').delay(400).animate({
      bottom: '150px',
      left: '95%'
    }, 200);
    
    $('.dark i, .light i, .colors i').delay(500).fadeIn(200);
    flag = 1;
  }
  
  else  {
    $('.dark, .light, .colors').animate({
      bottom: '50px',
      left: '95%'
    }, 200);
    
    $('.dark i, .light i, .colors i').delay(500).fadeOut(200);
    flag = 0;
  }
})

$('.dark').on('click', () => {
  if (flag == 1)
    setTheme('theme-dark')
});

$('.light').on('click', () => {
  if (flag == 1)
    setTheme('theme-light')
});

$('.colors').on('click', () => {
  if (flag == 1) {
    ipc.send('open-colored-themes')
  }
});

ipc.on('color-theme-chosen', function (event, arg) {
  setTheme(arg);
});
