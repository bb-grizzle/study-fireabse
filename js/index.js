// Field : 전역 변수
var db = firebase.firestore();
let data = [];
const post = document.querySelector('.post');
const list_post = document.querySelector('.list-post');
const form = document.querySelector('.form-post');
let nowId = '';
let nowList = null;

// method : 함수
// 데이터 읽기
function _get() {
  db.collection("todo").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {

      data.push({
        ...doc.data(),
        id: doc.id
      });

    });
  
    drawInitData();
  });
}

function drawInitData() {
  for (let i = 0; i < data.length; i++) {
    addPost(data[i].title,
      data[i].text,
      data[i].id);
  }
}

function formInit() {
  form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
  e.preventDefault();
  // 데이터 추가

  if(nowId === ''){
    
    // UPLOAD
    db.collection('todo').add({
      title: form.title.value,
      text: form.text.value
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      addPost(form.title.value, form.text.value, docRef.id); 
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

  }else{

    // UPDATE
    db.collection("todo").doc(nowId).update({
      title: form.title.value,
      text: form.text.value
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });

    nowList.querySelector('.title').innerHTML = form.title.value;
    nowList.querySelector('.text').innerHTML = form.text.value;

    nowId = '';
    nowList = null;

    form.title.value = '';
    form.text.value = '';

  }
  
  
}

function addPost(title, text, id) {
  // 01. list-post 클래스를 가져와서
  const post_temp = document.querySelector('.tamplate-js');
  // 02. 복사를 해서
  const tamplate = post_temp.cloneNode(true);
  tamplate.classList.remove('tamplate-js');
  tamplate.id = id;
  
  // event listener
  const btn_delete = tamplate.querySelector('.btn-delete-js');
  btn_delete.addEventListener('click', handleDeleteClick);
  const btn_edit = tamplate.querySelector('.btn-edit-js');
  btn_edit.addEventListener('click', handleEditClick);

  // 03. title, text를 넣고
  const tamp_title = tamplate.querySelector('.title');
  tamp_title.innerHTML = title;
  const tamp_text = tamplate.querySelector('.text');
  tamp_text.innerHTML = text;
  // 04. post 에 넣어라
  post.prepend(tamplate);
  // 05. form 의 title , text 비우기
  form.title.value = "";
  form.text.value = "";
}

function handleDeleteClick(e) {
  const list = e.target.parentNode.parentNode;
  const title = list.querySelector('.title').innerHTML;
  const result = confirm(`${title} 을(를) 삭제 하시겠습니까?`);
  if(result){
    list.remove();
    db.collection("todo").doc(list.id).delete().then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }
}

// 수정: update
// 01. 수정 버튼을 눌렸을때 > 해당 title, text 가 form 에 나타나게 한다. 
//     - 수정 클릭 이벤트
//     - form fjsdklfjdsk.value = 'title', 

// 02. 글씨를 바꾼 후 확인을 눌렸을 떄 > 해당 db 수정

function handleEditClick(e){
  // 01. id 확인
  nowList = e.target.parentNode.parentNode;
  nowId = nowList.id;

  // 02. 수정 버튼을 클릭한 카드의 정보를 폼에 표시
  // - data 를 이용한 방법
  // data.forEach(function(el){
  //   if(el.id === nowId){
  //     form.title.value = el.title;
  //     form.text.value = el.text;
  //   }
  // })

  // - dom 을 이용한 방법
  form.title.value = nowList.querySelector('.title').innerHTML;
  form.text.value = nowList.querySelector('.text').innerHTML;

  // 03. 제출 클릭 > fb update

  // 04. html 변경



}

function fillFrom(obj) {
  form.title.value = obj.title;
  form.text.value = obj.text;
}


// run
function init() {
  _get();
  drawInitData();
  formInit();
}

init();
