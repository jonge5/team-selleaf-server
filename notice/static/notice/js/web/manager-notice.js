// 페이지가 열릴 때 체크된 박스가 없다면 삭제 버튼 disabled
const deleteBtn = document.querySelector(".delete-button");

// 공지사항 리스트를 뿌릴 위치(객체)
const noticeList = document.querySelector("ul.notice-list");

// 가장 최근에 작성된 순으로 10개의 공지사항을 뿌리기 위해 초기값을 1로 설정
let page = 1

// 현재 체크된 박스의 개수를 세는 함수
const countCheckBoxes = () => {
  // 각 체크박스의 상태가 변할 때마다 체크된 박스의 개수를 셈
  const checkedBoxes = document.querySelectorAll("input[type='checkbox']:checked")

  // 체크된 박스가 하나라도 있다고 가정하고 삭제 버튼의 disabled 해제
  deleteBtn.disabled = false;

  // 체크된 박스가 하나도 없다면 삭제 버튼 disabled
  if (checkedBoxes.length === 0) {
    deleteBtn.disabled = true;
  }
}

// 체크박스 클릭 이벤트 추가 기능 함수화
const addCheckboxEvent = () => {
  // 체크박스 관련 js
  const allCheck = document.querySelector(".all-check");
  const checkboxes = document.querySelectorAll(".checkbox-input");

  // all-check 체크 여부에 따라 checkbox-input 체크 여부 조절
  allCheck.addEventListener("change", function () {
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = allCheck.checked;

      // 현재 체크된 박스 개수를 세서 삭제 버튼의 활성화 여부 조정
      countCheckBoxes();
    });
  });

  // checkbox-input 중 하나라도 체크가 해제되면 all-check 체크 해제
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      let allChecked = true;
      checkboxes.forEach(function (checkbox) {
        if (!checkbox.checked) {
          allChecked = false;
        }
      });
      allCheck.checked = allChecked;
    });
  });

  // checkbox-input 모두 체크되면 all-check 체크
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      let allChecked = true;
      checkboxes.forEach(function (checkbox) {
        if (!checkbox.checked) {
          allChecked = false;
        }
      });
      allCheck.checked = allChecked;
    });
  });

  // 체크박스의 체크 상태가 변할 때마다 체크된 박스 개수를 셈
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", countCheckBoxes);
  });
}

// 페이지가 열렸을 때 체크된 박스 개수를 셈
countCheckBoxes();

// 가져온 목록을 화면에 뿌리기 위한 함수
const showNotice = (notice_info) => {
  // 화면에 뿌릴 HTML 태그를 담을 빈 문자열
  let text = ``;

  // 나중에 페이지네이션을 위한 로직 작성

  // fetch 요청으로 받아온 데이터 할당
  let notices = notice_info.notices;

  // 공지사항의 제목과 내용을 아래의 HTML 태그로 묶어서 공지사항 목록 생성
  notices.forEach((notice) => {
    text += `
                  <li class="list-content ${notice.id}">
                    <input type="checkbox" class="checkbox-input" />
                    <button class="text-left">
                      <div class="list-content-wrap">
                        <div class="list-content-container">
                          <div class="list-content-inner">
                            <div class="content-name">
                              <p class="content-name">${notice.notice_title}</p>
                            </div>
                            <p class="content-name-detail">${notice.notice_content}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                    <div class="content-open-wrap"></div>
                    <a class="update-notice" href="/admin/notice/update/?id=${notice.id}">수정</a>
                  </li>
    `
  });

  return text;
}

// 위 함수들을 사용해서 페이지가 열렸을 때 화면에 공지사항 표시
noticeService.getList(page, showNotice).then((notices) => {
  noticeList.innerHTML = notices;

  // 체크박스 클릭 이벤트 추가
  addCheckboxEvent();
});

// 삭제 버튼 누르면 뜨는 모달창
document.addEventListener("DOMContentLoaded", function () {
  const deleteButtons = document.querySelectorAll(".delete-button");
  const modalWrap = document.querySelector(".delete-modal-wrap");

  deleteButtons.forEach(function (deleteButton) {
    deleteButton.addEventListener("click", () => {
      modalWrap.style.display = "flex";
    });
  });

  const cancelButton = document.querySelector(".modal-cancel button");
  const confirmButton = document.querySelector(".modal-confirm button");

  // 취소 버튼 누르면 모달창 닫힘
  cancelButton.addEventListener("click", () => {
    modalWrap.style.display = "none";
  });

  // 삭제 버튼 이벤트 - 체크된 공지사항만 삭제
  confirmButton.addEventListener("click", async () => {
    modalWrap.style.display = "none";

    // 삭제할 공지사항의 id를 담을 빈 문자열
    let deleteIds = ``;

    // 이 시점에서 체크된 박스 개수를 세고
    const checkedBoxes = document.querySelectorAll(".checkbox-input:checked");

    // 각 체크박스를 감싸는 li 태그의 id를 deleteIds에 추가
    // 사이사이에 콤마를 붙여서 뷰에서 .split을 쓸 수 있게 만들어줌
    checkedBoxes.forEach((checkbox) => {
      deleteIds += `,${checkbox.parentElement.classList[1]}`;
    })

    // 삭제할 공지사항들의 id를 삭제 API에 보냄
    await noticeService.deleteNotices(deleteIds);

    // 다시 현재 페이지 불러오기
    location.reload();
  });
});

//아래 게시물 창 버튼
const paginationBtn = document.querySelectorAll(".page-count-num");
const paginationBox = document.querySelector(".page");

paginationBox.addEventListener("click", (e) => {
  let pageBtn = e.target.closest("button.page-count-num");
  if (pageBtn) {
    paginationBtn.forEach((item) => {
      item.classList.contains("page-count-num") &&
        item.classList.remove("page-count-num-choice");
    });
    pageBtn.classList.add("page-count-num-choice");
  }
});

// 검색창 눌렀을때 검색바에 아웃라인주기
const searchBar = document.querySelector("label.search-bar");

document.addEventListener("click", (e) => {
  if (e.target.closest("label.search-bar")) {
    searchBar.classList.add("search-bar-checked");
    return;
  }
  searchBar.classList.remove("search-bar-checked");
});

const inputField = document.querySelector(".search-bar input");
const cancelButton = document.querySelector(".search-bar .cancel-logo");
const searchButton = document.querySelector(".search-bar .search-logo");

// 입력 필드에 입력 내용이 변경될 때마다 실행될 함수를 정의합니다.
function handleInputChange() {
  const inputValue = inputField.value.trim(); // 입력 내용을 가져옵니다.

  // 입력 내용이 있을 때
  if (inputValue !== "") {
    cancelButton.style.display = "flex"; // cancel-logo를 보여줍니다.
    searchButton.style.display = "none"; // search-logo를 숨깁니다.
  } else {
    // 입력 내용이 없을 때
    cancelButton.style.display = "none"; // cancel-logo를 숨깁니다.
    searchButton.style.display = "flex"; // search-logo를 보여줍니다.
  }
}

// cancel-logo를 클릭했을 때 실행될 함수를 정의합니다.
function handleCancelClick() {
  inputField.value = ""; // 입력 필드 내용을 지웁니다.
  cancelButton.style.display = "none"; // cancel-logo를 숨깁니다.
  searchButton.style.display = "flex"; // search-logo를 보여줍니다.
}

// 입력 필드에 이벤트 리스너를 추가합니다.
inputField.addEventListener("input", handleInputChange);

// cancel-logo에 클릭 이벤트 리스너를 추가합니다.
cancelButton.addEventListener("click", handleCancelClick);

// 공지사항 선택하는 js
const catebtns = document.querySelectorAll("#btn");
const cateUnder = document.querySelectorAll("#under");
cateUnder[0].classList.add("underbar-checked");
catebtns[0].classList.add("my_lecture-checked");

catebtns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    catebtns.forEach((btn, i) => {
      btn.classList.remove("my_lecture-checked");
      cateUnder[i].classList.remove("underbar-checked");
    });
    btn.classList.add("my_lecture-checked");
    cateUnder[i].classList.add("underbar-checked");
  });
});
