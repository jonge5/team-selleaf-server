// 수강생 목록 조회 JS

//
// // 온라인/오프라인 여부에 따라 표시할 정보 변경
// // 온라인/오프라인 여부
// const isOnline = false;
//
// // 오프라인일 때 표시할 강의 시간 컬럼
// const offlineInfos = document.querySelectorAll(".offline-title, .offline");
//
// // 온라인일 때 표시할 선택 키트 컬럼
// const onlineInfos = document.querySelectorAll(".online-title, .online");
//
// // 온라인/오프라인 여부에 따라 보여주는 컬럼 변경
// if (isOnline) {
//   onlineInfos.forEach((info) => {
//     info.style.display = "block";
//   });
//
//   offlineInfos.forEach((info) => {
//     info.style.display = "none";
//   });
// } else {
//   onlineInfos.forEach((info) => {
//     info.style.display = "none";
//   });
//
//   offlineInfos.forEach((info) => {
//     info.style.display = "block";
//   });
// }

// 각 내역 클릭하면 동반 수강생 목록 표시
// 각 수강 신청 내역들
const entries = document.querySelectorAll(".class-histories-wrap");

// 각 내역에 click 이벤트 추가
entries.forEach((item) => {
  // 각 내역 별 수강생들의 상세 리스트
  const allStudentList = item.nextElementSibling;

  // 내역 클릭하면 숨겨져있던 상세목록 표시
  item.addEventListener("click", (e) => {
    allStudentList.classList.toggle("open")
  });
});

let page = 1

const showTrainee = (trainees) =>{
  let text = ``
  trainees.forEach((trainee)=>{
    text =`
      <div>
        <div class="class-histories-wrap">
          <div class="class-history-items">강희주</div>
          <div class="class-history-items">3명</div>
          <div class="class-history-items">2024년 02월 20일</div>
          <div class="class-history-items offline">10:30</div>
          <div class="class-history-items online" style="display: none">
            키트 이름 1
          </div>
        </div>
        <div class="student-list-wrap">
          <div class="student-list-container">
            <ul class="student-list">
              <li class="student-list-items">강희주</li>
              <li class="student-list-items">백시현</li>
              <li class="student-list-items">김규일</li>
            </ul>
          </div>
        </div>
      </div>
    
    `
  })
}


