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
        const p = document.createElement("p");
        p.textContent = `${item.timestamp}  ${item.timerange}`;
        a.appendChild(p);
        li.appendChild(a);
        linkList.appendChild(li);
      });

      updateArticlesNumber()
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
function updateArticlesNumber(){
  let count = 0;
  const liList = document.querySelectorAll("#linkList li");
  Array.from(liList).filter(li => {
    const liStyle = getComputedStyle(li);
    if(liStyle.display !== "none"){
      count += 1;
    }
  })
  articlesNumber = count
  articleCounter.innerText = `${articlesNumber}件`
}

// カテゴリーボタンに、今絞り込んでいるカテゴリー名を表示
function filterButton(selectedCategory, buttonId) {
  document.querySelector('#' + buttonId).innerText = selectedCategory;
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
function filterLinks() {
  var li = document.querySelectorAll('#linkList li');
  var searchInputValue = document.querySelector('#searchInput').value.toUpperCase();
  var searchInputTexts = searchInputValue.split(/[ 　]+/);
  var searchButtons = document.querySelectorAll('.searchButton:not(#category-3)');
  var searchButtonTexts = Array.from(searchButtons)
    .map(button => button.innerText)
    .filter(text => !text.toLowerCase().includes("category"));

  const category3ButtonText = document.querySelector('#category-3').innerText.trim();
  const maruNumbers = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", "⑬", "⑭", "⑮", "⑯", "⑰", "⑱", "⑲", "⑳", "㉑", "㉒", "㉓", "㉔", "㉕", "㉖", "㉗", "㉘", "㉙", "㉚", "㉛", "㉜", "㉝", "㉞", "㉟", "㊱", "㊲", "㊳", "㊴", "㊵", "㊶", "㊷", "㊸", "㊹"]

  for (var i = 0; i < li.length; i++) {
    var h4 = li[i].getElementsByTagName('h4')[0];
    var txtValue = h4.textContent || h4.innerText;
    var shouldDisplay = false;

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

    li[i].style.display = shouldDisplay ? '' : 'none';
  }
  updateArticlesNumber()
}

document.querySelector('#searchInput').addEventListener('keyup', () => {
  document.querySelector('#clear-button').classList.remove('none')
  filterLinks()
});

document.querySelector('#clear-button').addEventListener('click', ()=>{
  document.querySelector('#searchInput').value = "";
  document.querySelector('#clear-button').classList.add('none')
  filterLinks()
})

document.querySelector('#title').addEventListener('click', ()=>{
  document.querySelectorAll('.dropdown .btn').forEach(btn => {
    btn.innerText = `${btn.id} `;
  });
  document.querySelector('#searchInput').value = "";
  document.querySelector('#clear-button').classList.add('none')
  filterLinks()
})