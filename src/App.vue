<template>
  <div class="main_content">
    <AppHeader :resetData="resetData"/>
    <router-view></router-view>  

    <input class="enter-activity" type="text" v-model="activityName" placeholder="Введіть нову активність" />
    <button class="button-add" @click="AddActivity">Додати</button>
    <div class="line"></div>
    <p class="error" v-if="error">{{ error }}</p>

    <TimeTrackActivity v-for="(el, index) in activities" 
    :key="index" 
    :activity="el"  
    :index="index"  
    :DeleteActivity="DeleteActivity"  
    :StartTimer="StartTimer"
    :StopTimer="StopTimer"
    :EditActivity="openEditModal" 
    :isEditing="isEditing" />
  
    <p class="notfill-activities" v-if="activities.length == 0">Кожна хвилина - це можливість! <br>Розпочни відстеження часу та стань продуктивнішим. </p>

    <div class="facts-container">
      <div class="fact-1">
       <div class="fact1-desc">
        <img class="img-fact1" src = "/question.png">
        <p class="fact1">Продуктивність зростає, якщо ти бачиш прогрес</p>
      </div>

       <div class="fact1-info">
         <p>Введення записів про витрачений час допомагає <br> збільшити продуктивність на 30%.</p>
         <p>Коли люди бачать, скільки годин вони реально працюють, <br>вони починають ефективніше розподіляти навантаження.</p>
      </div>
       </div>

        <div class="fact2">
         <div class="fact2-desc">
          <img class="img-fact1" src = "/question.png">
          <p class="fact1">Трекінг допомагає уникати вигорання</p>
         </div>

        <div class="fact2-info">
          <p>61% працівників віддаленої роботи працюють більше, ніж потрібно, <br>бо не помічають, скільки часу проводять за екраном.</p>
          <p>Контроль активностей дозволяє уникати перевантаження та<br> працювати більш збалансовано.</p> 
        </div>
     </div>
    </div>

    <div class="questions">
    <div class="questions-header">
      <img class="question-icon" src="/questionIcon.png" />
      <p class="questions-title">Часті запитання</p>
    </div>
    
    <div class="faq-item" v-for="(item, index) in questions" :key="index">
      <div class="faq-question" @click="toggleAnswer(index)">
        <p>{{ item.question }}</p>
        <img :class="{ 'rotated': item.showAnswer }" class="icon" src="/tick.png" />
      </div>
      <transition name="fade">
        <p v-if="item.showAnswer" class="faq-answer">{{ item.answer }}</p>
      </transition>
   </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h3>Редагувати активність</h3>
        <input v-model="editedActivityName" type="text" placeholder="Нова назва активності" />
        <button @click="saveEditedActivity">Зберегти</button>
        <button @click="closeEditModal">Закрити</button>
      </div>
    </div>
</div>
</template>

<script>
import TimeTrackActivity from './components/TimeTrackActivity.vue'
import AppHeader from './components/AppHeader.vue'

export default {
  components: { TimeTrackActivity, AppHeader },
  data() {
    return {
      activities: [],
      activityName: '',
      error: '',
      isEditing: false, 
      isModalOpen: false,
      editedActivityName: '',
      editedActivityIndex: null,
      questions: [
        { question: "Як розпочати роботу із системою?", answer: "Щоб розпочати, додайте нову активність у полі введення.", showAnswer: false },
        { question: "Що відбувається, коли я запускаю нову активність?", answer: "Якщо запущена інша активність, інша не зупиняється.", showAnswer: false },
        { question: "Чи можна редагувати час активності вручну?", answer: "Так, в налаштуваннях ви можете змінити час будь-якої активності.", showAnswer: false },
        { question: "Як зрозуміти, яка активність зараз запущена?", answer: "Запущена активність буде мати активний таймер.", showAnswer: false },
        { question: "Як переглянути загальну кількість годин за день/місяць?", answer: "Перейдіть до розділу 'Звітність', щоб переглянути деталі.", showAnswer: false }
      ]
    }
  },
  mounted() {
  this.loadActivities();
},
methods: {
  AddActivity() {
    if (this.activityName.trim() == '') {
      this.error = 'Активність не веденна';
      return;
    }
    this.error = '';

    this.activities.push({
      name: this.activityName,
      date: new Date().toLocaleDateString('uk-UA'), 
      startTime: null,
      elapsedTime: 0,
      isRunning: false, 
      timer: null, 
      timePeriods: [] 
    });
    this.activityName = '';
    this.saveActivities(); // викликаємо збереження після додавання
  },
  
  DeleteActivity(index) {
    let activity = this.activities[index];
    if (activity.isRunning) {
      clearInterval(activity.timer);
    }
    this.activities.splice(index, 1);
    this.saveActivities(); // оновлення збережених даних
  },

  StartTimer(index) {
    let activity = this.activities[index];
    if (!activity.isRunning) {
      activity.startTime = Date.now() - activity.elapsedTime * 1000;
      activity.isRunning = true;

      activity.timer = setInterval(() => {
        activity.elapsedTime = Math.floor((Date.now() - activity.startTime) / 1000);
      }, 1000);
    }
    this.saveActivities();
  },

  StopTimer(index) {
    let activity = this.activities[index];
    if (activity.isRunning) {
      clearInterval(activity.timer);

      // додавання нового періода часу до масиву
      activity.timePeriods.push({
        start: new Date(activity.startTime),
        end: new Date(),
        duration: activity.elapsedTime
      });

      activity.isRunning = false;
      activity.elapsedTime = 0;
    }
    this.saveActivities();
  },

  toggleAnswer(index) {
    this.questions[index].showAnswer = !this.questions[index].showAnswer;
  },

  saveActivities() {
    localStorage.setItem("activities", JSON.stringify(this.activities));
  },

   loadActivities() {
    let savedData = localStorage.getItem("activities");
    if (savedData) {
      this.activities = JSON.parse(savedData);
      this.activities.forEach((activity) => {
        if (activity.isRunning) {
          let now = Date.now();
          activity.elapsedTime = Math.floor((now - activity.startTime) / 1000);

          activity.timer = setInterval(() => {
            activity.elapsedTime = Math.floor((Date.now() - activity.startTime) / 1000);
          }, 1000);
        }
      });

      localStorage.setItem("activities", JSON.stringify(this.activities));
    }
  },

  openEditModal(index) {
      this.editedActivityName = this.activities[index].name;
      this.editedActivityIndex = index;
      this.isModalOpen = true;
    },
    
    closeEditModal() {
      this.isModalOpen = false;
      this.editedActivityName = '';
    },
    
    saveEditedActivity() {
      if (this.editedActivityName.trim() === '') return;
      this.activities[this.editedActivityIndex].name = this.editedActivityName;
      this.isModalOpen = false;
      this.saveActivities();
    },
    
    resetData() {
    this.activities = [];
    localStorage.removeItem("activities");
  },

}
  }
</script>

<style scoped>
.main_content{
  margin-top: 125px;
  margin-left: 85px;
  margin-right: 85px;
}
div {
  text-align: center;
}
.line {
  border-bottom: 2px solid #afafaf; 
  margin: 40px 0; /* відступи до і після лінії */
}
.error {
  text-align: center;
  color: rgb(222, 78, 78);
  font-family: 'Montserrat'; 
  font-size: 14px;
}
.enter-activity {
  width: 400px; 
  height: 40px; 
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #afafaf; 
  font-family: 'Montserrat'; 
  font-size: 16px; 
  margin-right: 15px; 
  margin-top: 15px;
}
.notfill-activities{
  font-family: 'Montserrat', sans-serif; 
  font-size: 18px;
  margin-top: 30px;
}
.button-add{
  padding: 10px 20px; /* збільшення відступів */
  background-color: black; 
  color: white; 
  font-family: 'Montserrat';
  font-size: 16px;
  border: none; /* видаляє рамку у елемента */
  border-radius: 8px; 
  cursor: pointer; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); 
  transition: background-color 0.3s ease, box-shadow 0.3s ease; 
}
.button-add:hover {
  background-color: #333; 
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); 
  transform: scale(1.05); /* збільшення кнопки на 5% */
  /*  scale(1) – звичайний (стандартний) розмір.
      scale(1.05) – збільшує елемент на 5% від його початкового розміру.
      scale(0.9) – зменшує елемент на 10%. */
}

.facts-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* вирівнювання по верхньому краю */
  gap: 20px; 
}
.fact-1, .fact2 {
  flex: 1; /* обидва блоки будуть займати рівну ширину */
  max-width: 50%; /* щоб не тягнулися на всю ширину */
  padding: 20px;
}
.fact1-desc, .fact2-desc {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.img-fact1 {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.fact1, .fact2 {
  font-family: 'Montserrat';
  font-style: italic;
  font-size: 20px;
}
.fact1-info p, .fact2-info p {
  font-family: 'Montserrat';
  font-size: 16px;
  text-align: left;
  margin-left: 40px;
}


.questions {
  max-width: 700px;
  margin: 40px auto;
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.questions-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.question-icon {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.questions-title {
  font-size: 22px;
  font-family: 'Montserrat';
}
.faq-item {
  border-bottom: 1px solid #cac9c9;
  padding: 18px 0;
}
.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.faq-question p {
  font-size: 18px;
  font-family: 'Montserrat';
  margin: 0;
}
.icon {
  width: 25px;
  height: 25px;
  transition: transform 0.3s;
}
.rotated {
  transform: rotate(180deg);  /* елемент обертається на 180 градусів за годинниковою стрілкою */
}
.faq-answer {
  font-size: 16px;
  font-family: 'Montserrat';
  color: #555;
  margin-top: 10px;
  line-height: 1.5;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.modal-content h3{
  font-family: 'Montserrat';
}

.modal-content input {
  width: 80%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
}

.modal-content button {
  padding: 10px 20px;
  background-color: #999999;
  color: white;
  border: none;
  border-radius: 8px;
  margin-right: 10px; 
  font-family: 'Montserrat';
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: #545454;
}
</style>