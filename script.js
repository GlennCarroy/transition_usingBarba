//Etape 1: empêcher le comportement par défaut
//du navigateur.

// Note, we are purposely binding our listener on the document object
// so that we can intercept any anchors added in future.
document.addEventListener('click', function(e) {
  var el = e.target;

  // Go up in the nodelist until we find a node with .href (HTMLAnchorElement)
  while (el && !el.href) {
    el = el.parentNode;
  }
// Ici on va empêcher l'exécution par défaut du "click")
  if (el) {
    e.preventDefault();
    return;
  }
});

//==============================================

//Etape 2: Fetch the page
//Récupère les données de la page "cliquée" mais
//sans les faire apparaître.

function loadPage(url) {
  return fetch(url, {
    method: 'GET'
  }).then(function(response) {
    return response.text();
  });
}

//===============================================

//Etape 3: change the current URL

//On utilise l'API "pushstate"
// we are using it to modify the current URL 
// to be the URL of the next page. 
// Note that this is a modification of our 
// previously declared anchor click-event 
// handler (el).
if (el) {
  e.preventDefault();
  history.pushState(null, null, el.href); //-->la source du lien
  changePage();

  return;
}

window.addEventListener('popstate', changePage);

//popstate et pushstate = aller d'avant en arrière dans la nav.

//===============================================

//Etape 4: faire apparaître le contenu.
// Avec changePage qui va en fait "swapper" le main de la page
// (puisque header et footer ne bougent pas sur un site)

var main = document.querySelector('main');

function changePage() {
  // Note, the URL has already been changed
  var url = window.location.href;

  loadPage(url).then(function(responseText) {
    var wrapper = document.createElement('div');
        wrapper.innerHTML = responseText;

    var oldContent = document.querySelector('.cc');
    var newContent = wrapper.querySelector('.cc');

    main.appendChild(newContent);
    animate(oldContent, newContent);
  });
}

//===============================================

//Etape 5: animate!

function animate(oldContent, newContent) {
  oldContent.style.position = 'absolute';

  var fadeOut = oldContent.animate({
    opacity: [1, 0]
  }, 1000);

  var fadeIn = newContent.animate({
    opacity: [0, 1]
  }, 1000);

  fadeIn.onfinish = function() {
    oldContent.parentNode.removeChild(oldContent);
  };
}

