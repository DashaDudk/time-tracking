<template>
  <div class="report">
    <h1>Звітність</h1>

    <div class="filters">
      <label for="month">Виберіть місяць:</label>
      <select id="month" v-model="selectedMonth" @change="filterData">
        <option value="">Всі місяці</option>
        <option v-for="month in months" :key="month.value" :value="month.value">
          {{ month.name }}
        </option>
      </select>

      <label for="day">Виберіть день:</label>
      <input type="date" id="day" v-model="selectedDay" @change="filterData" />
    </div>

    <table v-if="filteredActivities.length">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Активність</th>
          <th>Періоди</th>
          <th>Тривалість</th>
          <th>Загальний час</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(activity, index) in filteredActivities" :key="index"> <!-- перебирає кожен елемент масиву filteredActivities та додає в таблицю -->
          <td>{{ getActivityStartDate(activity) }}</td>
          <td>{{ activity.name }}</td>
          <td>
            <div v-for="(period, i) in activity.timePeriods" :key="i">
              {{ formatTime(period.start) }} - {{ formatTime(period.end) }}
            </div>
          </td>
          <td>
            <div v-for="(period, i) in activity.timePeriods" :key="i">
              {{ period.duration ? formatDuration(period.duration) : "-" }}
            </div>
          </td>
           <td class="total-time">{{ calculateTotalTime(activity.timePeriods) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Немає активностей для цього фільтру</p>
  </div>
</template>

<script>
export default {
  name: "ActivityReports",
  data() {
    return {
      selectedMonth: "",
      selectedDay: "",
      activities: [],
      filteredActivities: [],
      months: [
        { name: "Січень", value: "01" },
        { name: "Лютий", value: "02" },
        { name: "Березень", value: "03" },
        { name: "Квітень", value: "04" },
        { name: "Травень", value: "05" },
        { name: "Червень", value: "06" },
        { name: "Липень", value: "07" },
        { name: "Серпень", value: "08" },
        { name: "Вересень", value: "09" },
        { name: "Жовтень", value: "10" },
        { name: "Листопад", value: "11" },
        { name: "Грудень", value: "12" },
      ],
    };
  },

  created() {  /* loadActivities() викликається одразу при завантаженні сторінки, щоб отримати активності з localStorage */
    this.loadActivities(); 
    },

  methods:
   {
    loadActivities() {
      const storedActivities = localStorage.getItem("activities"); /* отримує дані, які були збережені в localStorage під ключем "activities" */
      this.activities = storedActivities ? JSON.parse(storedActivities) : [];/*  перетворення JSON-рядка в масив (або створення порожнього масиву) */
      const currentMonth = new Date().getMonth() + 1;
      this.selectedMonth = String(currentMonth).padStart(2, "0"); 
      /* String(currentMonth) перетворює число в рядок.
      .padStart(2, "0") додає нуль на початок, якщо число складається з однієї цифри (наприклад, "2" → "02").
      Це потрібно для узгодження формату MM (місяць у двох знаках). */
      this.filterData();
    },

    filterData() {
      let activities = [...this.activities]; /* копія масиву activities */

      if (this.selectedMonth) {
        activities = activities.filter((activity) => {
          const month = activity.date.split(".")[1]; /* витягує місяць із дати у форматі "ДД.ММ.РРРР" */
          return month === this.selectedMonth;
        });
      }

      if (this.selectedDay) {
        const formattedDay = this.formatDateToDDMMYYYY(this.selectedDay);
        activities = activities.filter((activity) => activity.date === formattedDay);
      }

      this.filteredActivities = activities; /* зберігає результат у filteredActivities */
    },

    formatDateToDDMMYYYY(date) {
      if (!date) return "";
      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
    },

    formatTime(date) { /* форматує час у години:хвилини:секунди */
      const options = { hour: "2-digit", minute: "2-digit", second: "2-digit" }; 
      return new Date(date).toLocaleTimeString("uk-UA", options);
    },

    formatDuration(seconds){ 
    if(!seconds) return "-"; /* якщо seconds має значення 0, метод одразу поверне "-" */

    const h = Math.floor(seconds/3600); //Math.floor(...) – відкидає дробову частину, залишаючи тільки цілі години
    const m = Math.floor((seconds%3600)/60); //seconds % 3600 – залишок секунд після вирахування повних годин
                                            //3800 % 3600 = 200 секунд (3800 секунд = 1 година + 200 секунд)
                                             //Ділимо цей залишок на 60, щоб отримати кількість хвилин.
                                             //200 / 60 = 3.33 → Math.floor(3.33) = 3 хвилини
    const s = seconds%60;     //seconds % 60 – залишок секунд після вирахування повних хвилин

    let result = [];
    if(h) result.push(`${h} год`);
    if(m) result.push(`${m} хв`);
    if(s || (!h && !m)) result.push(`${s} сек`);

    return result.join(" ")  //join(" ") об'єднує всі елементи масиву result у єдиний рядок, розділяючи пробілом
                             //["5 хв", "42 сек"].join(" ")
    },

    calculateTotalTime(timePeriods) {
    let totalSeconds = 0;
    timePeriods.forEach(period => {
      if (period.duration) {
        totalSeconds += period.duration;
      }
    });

    return this.formatDuration(totalSeconds); // перетворюємо на формат "години хвилини"
  },

  getActivityStartDate(activity) {
  if (!activity.timePeriods || activity.timePeriods.length === 0) {
    return "-";
  }
  return new Date(activity.timePeriods[0].start).toLocaleDateString("uk-UA");
}
  },

};
</script>

<style scoped>

.report {
  max-width: 1100px; 
  margin: 0 auto;
  padding: 30px;
  font-family: 'Montserrat';
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  border-radius: 15px;
  box-shadow: 8px 8px 16px #b8b8b8, -8px -8px 16px #ffffff;
  position: relative;
  top: 125px;
}

.report h1 {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  color: #222;
  font-weight: 700;
  letter-spacing: 5px;
  font-family: 'Monsterrat';
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
}
.filters label {
  font-size: 16px;
  color: #444;
  font-weight: 500;
}
.filters select,
.filters input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  width: 180px;
  transition: all 0.3s ease;
}
.filters select:focus,
.filters input:focus {
  border-color: #aeaeae;
  outline: none;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
}
table {
  width: 100%;
  border-collapse: collapse; /* межі сусідніх комірок зливаються в одну загальну лінію */
  margin-top: 20px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.1);
}
table th,
table td {
  padding: 18px;
  text-align: left;
  border-bottom: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}
table th {
  background-color: #222;
  color: #fff;
  font-weight: 600;
  text-transform: uppercase; /* uppercase	Усі літери стають великими.
                                lowercase	Усі літери стають малими.
                                capitalize	Кожне слово починається з великої літери.
                                none	Скасовує всі зміни у трансформації тексту. */
}
table tbody tr:hover {
  background: linear-gradient(145deg, #f0f0f0, #dcdcdc);
  cursor: pointer;
  transform: scale(1.02);
  transition: all 0.3s ease;
}
table td div {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}
table td.total-time {
  font-weight: 700;
  color: #111;
}

</style>
