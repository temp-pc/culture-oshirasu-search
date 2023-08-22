const baseURL = "https://shirasu.io"


// data.jsonをもとにリンクのリストを表示
document.addEventListener("DOMContentLoaded", function () {
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      const linkList = document.getElementById("linkList");

      data.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      data.data.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        item.link.includes(baseURL) ? a.href = item.link : a.href = baseURL + item.link;
        a.target = '_blank';
        const h4 = document.createElement("h4");
        h4.textContent = item.title;
        a.appendChild(h4);


        const divElement = document.createElement("div")
        divElement.classList.add("row", "d-flex", "justify-content-between")

        const p = document.createElement("p");
        p.textContent = `${item.timestamp}  ${item.timerange}`;

        const buttonElement = document.createElement("button")
        buttonElement.classList.add("addButton", "btn", "ml-auto")
        buttonElement.setAttribute('onclick', `addToList(this)`);

        const buttonSpanElement = document.createElement("span");

        const addIcon = document.createElement("img")
        addIcon.setAttribute("src", "images/add_black_24dp.svg")
        addIcon.classList.add("addIcon")
        const doneIcon = document.createElement("img")
        doneIcon.setAttribute("src", "images/done_black_24dp.svg")
        doneIcon.classList.add("doneIcon")

        const isAdded = savedList.URL_list.includes(a.href);
        buttonElement.classList.toggle("isAdded", isAdded)
        addIcon.classList.toggle("none", isAdded)
        doneIcon.classList.toggle("none", !isAdded)

        buttonSpanElement.innerText = isAdded ? "added" : "add to list"
        buttonElement.appendChild(buttonSpanElement)
        buttonElement.appendChild(addIcon)
        buttonElement.appendChild(doneIcon)

        divElement.appendChild(p)
        divElement.appendChild(buttonElement)

        li.appendChild(a);
        li.appendChild(divElement);

        hr = document.createElement("hr")
        li.appendChild(hr)

        linkList.appendChild(li);
      });

      updateArticlesNumber();
      addedToListCounter();
    })
    .catch(error => console.error("Error fetching JSON:", error));
});

// categories.jsonを元にcategoryボタンのドロップダウンリストを作成
document.addEventListener("DOMContentLoaded", function () {
  fetch("categories.json")
    .then(response => response.json())
    .then(data => {
      const categoryList1 = document.getElementById("categoryList1");
      const categoryList2 = document.getElementById("categoryList2");
      const categoryList3 = document.getElementById("categoryList3");

      data.category1.forEach(category => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a class="dropdown-item" href="#">${category}</a>`;
        categoryList1.appendChild(listItem);
      });

      data.category2.forEach(category => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a class="dropdown-item" href="#">${category}</a>`;
        categoryList2.appendChild(listItem);
      });

      data.category3.forEach(category => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a class="dropdown-item" href="#">${category}</a>`;
        categoryList3.appendChild(listItem);
      });

      const categoryLinks = document.querySelectorAll(".dropdown-item")
      categoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
          event.preventDefault(); // リンクのデフォルト動作を無効化
          const selectedCategory = link.textContent.trim(); // 選択されたカテゴリ
          const buttonId = link.closest(".dropdown").querySelector(".dropdown-toggle").id; // ボタンのID
          filterButton(selectedCategory, buttonId);
        })
      })


    })
    .catch(error => console.error("Error fetching JSON:", error));
});


// 表示されているリンク数をカウント
const articleCounter = document.querySelector("#articleCounter");
let articlesNumber = 0;
function updateArticlesNumber() {
  let count = 0;
  const liList = document.querySelectorAll("#linkList li");
  Array.from(liList).filter(li => {
    const liStyle = getComputedStyle(li);
    if (liStyle.display !== "none") {
      count += 1;
    }
  })
  articlesNumber = count
  articleCounter.innerText = `${articlesNumber}件`
}

// カテゴリーボタンに、今絞り込んでいるカテゴリー名を表示
function filterButton(selectedCategory, buttonId) {
  document.querySelector('#' + buttonId).textContent = selectedCategory;
  filterLinks()
}

// ボタンを押すと、絞り込みを解除。絞り込みをしているカテゴリー名を削除して、ボタンのid名に戻す
document.querySelectorAll('.dropdown .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const btnId = btn.id;
    filterButton(`${btnId} `, btnId)
  });
})

// カテゴリーボタンと検索ワードを元にリンクを絞り込み
function filterLinks(showMyList) {
  const li = document.querySelectorAll('#linkList li');
  const searchInputValue = document.querySelector('#searchInput').value.toUpperCase();
  const searchInputTexts = searchInputValue.split(/[ 　]+/);
  const searchButtons = document.querySelectorAll('.searchButton:not(#category-3)');
  const searchButtonTexts = Array.from(searchButtons)
    .map(button => button.textContent)
    .filter(text => !text.toLowerCase().includes("category"));

  const category3ButtonText = document.querySelector('#category-3').textContent.trim();
  const maruNumbers = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", "⑬", "⑭", "⑮", "⑯", "⑰", "⑱", "⑲", "⑳", "㉑", "㉒", "㉓", "㉔", "㉕", "㉖", "㉗", "㉘", "㉙", "㉚", "㉛", "㉜", "㉝", "㉞", "㉟", "㊱", "㊲", "㊳", "㊴", "㊵", "㊶", "㊷", "㊸", "㊹"]

  for (let i = 0; i < li.length; i++) {
    const h4 = li[i].querySelector('h4');
    const txtValue = h4.textContent || h4.innerText;
    const linkURL = li[i].querySelector('a').getAttribute('href');
    let shouldDisplay = false;

    if (showMyList) {
      if (savedList.URL_list.includes(linkURL)) {
        shouldDisplay = true;
      }
    } else if (showMyList === false) {
      shouldDisplay = true;  //showMyListの解除の場合は全てを表示
    } else {
      showMyListButton.classList.remove("shown")
      if (
        searchInputTexts.every(inputText => txtValue.toUpperCase().includes(inputText.toUpperCase()))
        &&
        searchButtonTexts.every(text => txtValue.includes(text))
        &&
        (
          category3ButtonText == "category-3"
          ||
          txtValue.toUpperCase().includes(`「${category3ButtonText}`)
          ||
          maruNumbers.some(maruNumber => txtValue.includes(`${category3ButtonText}${maruNumber}`))
        )
      ) {
        shouldDisplay = true;
      }
    }

    li[i].style.display = shouldDisplay ? '' : 'none';
  }
  updateArticlesNumber()
}


// inputでフリーワード検索
document.querySelector('#searchInput').addEventListener('input', () => {
  document.querySelector('#clear-button').classList.remove('none')
  filterLinks()
});
// スマホ用に追加
document.querySelector('#searchInput').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); 
    document.querySelector('#clear-button').classList.remove('none');
    filterLinks();
  }
});



document.querySelector('#clear-button').addEventListener('click', () => {
  document.querySelector('#searchInput').value = "";
  document.querySelector('#clear-button').classList.add('none')
  filterLinks()
})

document.querySelector('#title').addEventListener('click', () => {
  document.querySelectorAll('.dropdown .btn').forEach(btn => {
    btn.textContent = `${btn.id} `;
  });
  document.querySelector('#searchInput').value = "";
  document.querySelector('#clear-button').classList.add('none')
  filterLinks();
  window.scrollTo(0, 0);
})


let savedList = localStorage.getItem('watchLaterList');
if (!savedList) {
  savedList = { URL_list: [] };
} else {
  savedList = JSON.parse(savedList);
}
//addButton（mylistへ追加）の処理
function addToList(btn) {
  const parentLi = btn.closest('li');
  const linkURL = parentLi.querySelector('a').getAttribute("href");
  const buttonTextElement = btn.querySelector('span');
  const isAdded = savedList.URL_list.includes(linkURL);

  if (!isAdded) {
    savedList.URL_list.push(linkURL);
    localStorage.setItem('watchLaterList', JSON.stringify(savedList));
  } else {
    savedList.URL_list = savedList.URL_list.filter(url => url !== linkURL);
    localStorage.setItem('watchLaterList', JSON.stringify(savedList));
  }
  buttonTextElement.innerText = !isAdded ? "added" : "add to list";
  btn.classList.toggle("isAdded", !isAdded)
  btn.querySelector(".addIcon").classList.toggle("none", !isAdded)
  btn.querySelector(".doneIcon").classList.toggle("none", isAdded)
  addedToListCounter()
}

const listCounterElement = document.querySelector("#addedToListCounter")
function addedToListCounter(){
  let count = savedList.URL_list.length;
  listCounterElement.textContent = count;
  listCounterElement.classList.toggle("none", count == 0 )
}

// リスト表示ボタンがクリックされたときの処理
const showMyListButton = document.querySelector('#listButton');
showMyListButton.addEventListener('click', function () {
  showMyList = showMyListButton.classList.toggle("shown")
  filterLinks(showMyList)
})