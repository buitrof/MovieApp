let movies = []
let nomElements = document.getElementById('nominations')

function getCount(parent, getChildrensChildren) {
  let relevantChildren = 0
  let children = parent.childNodes.length
  for (let i = 0; i < children; i++) {
    if (parent.childNodes[i].nodeType != 3) {
      if (getChildrensChildren)
        relevantChildren += getCount(parent.childNodes[i], true)
      relevantChildren++
    }
  }
  return relevantChildren
}

document.getElementById('searchMovie').addEventListener('click', event => {
  event.preventDefault()
  document.getElementById('movies').innerHTML = ''
  fetch(`https://www.omdbapi.com/?s=${document.getElementById('title').value}&type=movie&apikey=5da35a24`)
    .then(r => r.json())
    .then(({ Search }) => {
      movies.unshift(Search)
      for (let i = 0; i < 8; i++) {
      let movieElem = document.createElement('div')
      movieElem.innerHTML = `
      <div class="card">
        <img src="${Search[i].Poster}" alt="${Search[i].Title}" class="card-img-top">
        <div class="card-body">
          <h4 class="card-title">${Search[i].Title}</h4>
          <h5>Year: ${Search[i].Year}</h5>
        </div>
        <button value="${i}" class="btn btn-success addNominations" id="nomButton-${i}">Add To Nominations</button>
      </div>
      `
    document.getElementById('movies').append(movieElem)
    document.getElementById('title').value = ''
    }
    })
})

document.addEventListener('click', event => {
  if (event.target.classList.contains('addNominations')) {
    let index = parseInt((event.target.value))
    let nomElem = document.createElement('div')
    nomElem.className = 'card'
    nomElem.innerHTML = `
              <div class="card-body">
                <h4>${movies.flat()[index].Title}</h4>
                <h5>Year: ${movies.flat()[index].Year}</h5>
                <button value="${index}" class="btn btn-danger removeNominations id="remButton-${index}">Remove from Nominations</button>
              </div>
          `
    document.getElementById('nominations').append(nomElem)
    let limit = getCount(nomElements, false)
    document.getElementById(`nomButton-${index}`).setAttribute('disabled', 'true')
    if (limit === 6) {
      $('#exampleModal').modal('show')
    }
  } else if (event.target.classList.contains('removeNominations')) {
    let index = parseInt((event.target.value))
    event.target.parentNode.parentNode.remove()
    document.getElementById(`nomButton-${index}`).removeAttribute('disabled')
  } else if (event.target.classList.contains('reset')) {
    location.reload()
  }
})