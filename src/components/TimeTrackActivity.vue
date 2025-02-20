<template>
  <div class="el">
    <div class="el-name">
    <div class="status-indicator" :class="{ active: activity.isRunning }"></div> <!-- динамічне привласнення класу -->
<!--     Якщо activity.isRunning = false
    <div class="status-indicator"></div>
    Квадратик буде сірим (колір за замовчуванням у CSS).
    
    Якщо activity.isRunning = true
    <div class="status-indicator active"></div>
👉 До квадратика додається клас active, і CSS підсвічує його зеленим. -->
    <h3>{{ activity.name }}</h3>
    </div>

    <ButtonsStartStop 
      :activity="activity"
      :index="index"
      :StartTimer="StartTimer"
      :StopTimer="StopTimer"
    />

    <div class="buttons">
    <button class="button" @click="DeleteActivity(index)">Видалити</button>
    <button class="button" @click="EditActivity(index)">Редагувати</button>
    </div>

    <div class="el-time">
      <p>{{ formattedTime }}</p>
    </div>

  </div>
</template>

<script>
import ButtonsStartStop from './ButtonsStartStop.vue'
export default {
  components: { ButtonsStartStop },

  props: {
    activity: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    DeleteActivity: {
      type: Function,
      required: true,
    },
    StartTimer: {
      type: Function,
      required: true,
    },
    StopTimer: {
      type: Function,
      required: true,
    },
    EditActivity: {
      type: Function,
      required: true,
    },
    isEditing: Boolean, 
  },
  
  computed: {
    formattedTime() {
      let totalSeconds = this.activity.elapsedTime;
      let days = Math.floor(totalSeconds / 86400);
      let hours = Math.floor((totalSeconds % 86400) / 3600);
      let minutes = Math.floor((totalSeconds % 3600) / 60);
      let seconds = totalSeconds % 60;

      let timeString = [hours, minutes, seconds]
        .map(unit => String(unit).padStart(2, '0'))
        .join(':');

      return days > 0 ? `${days} день ${timeString}` : timeString;
    }
  }
}
</script>

<style scoped>
.el {
  display: flex;
  align-items: center;
  gap: 100px;
  background-color: #F5F5F5;
  margin-bottom: 20px;
}
.el-name{
  display: flex;
  width: 490px;
  height: 38px;
  background-color: rgb(255, 255, 255);
  font-family: 'Montserrat';
  font-size: 14px;
  text-align: left;
  padding-left: 10px;
  align-items: center; /* вирівнює текст по вертикалі */
  justify-content: flex-start; /* текст залишається зліва */
  gap: 10px;
}
.el-name h3{
  font-weight: normal; /* за замовчуванням h3 має жирний шрифт */
}
.status-indicator {
  width: 15px;
  height: 15px;
  background-color: rgb(179, 178, 178);
  border-radius: 3px;
  transition: background-color 0.3s ease;
}
.status-indicator.active {
  background-color: rgb(136, 241, 136);
}
.el-time{
  position: absolute;
  left: 1250px;
  font-family: 'Montserrat';
  font-size: 16px;
}
.button {
  height: 32px;
  width: 115px;
  color: black;
  font-family: 'Montserrat';
  font-size: 16px;
  background-color: #e2e2e2;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(132, 129, 129, 0.2); 
  transition: background-color 0.3s ease, box-shadow 0.3s ease; 
}
.buttons {
  display: flex;
  gap: 18px; 
  margin-left: 70px;
}
.button:hover {
  background-color: #bababa; 
  box-shadow: 0 6px 12px rgba(125, 122, 122, 0.5); /* box-shadow: [горизонтальне зміщення тіні] [вертикальне зміщення тіні] [рівень розмиття] [наскільки збільшується тінь] [колір]; */
  transform: scale(1.05); /* збільшення кнопки на 5% */
  /*  scale(1) – звичайний (стандартний) розмір.
      scale(1.05) – збільшує елемент на 5% від його початкового розміру.
      scale(0.9) – зменшує елемент на 10%. */
}
</style>