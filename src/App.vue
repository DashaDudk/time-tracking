<template>
  <div class="app">
    <AppHeader @resetData="resetData" /> <!-- обробляється подія resetData -->
    <router-view :key="componentKey"></router-view> <!-- додаємо :key для примусового оновлення -->
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';

export default {
  components: { AppHeader },

  data() {
    return {
      componentKey: 0, // ключ для примусового оновлення компоненту
    };
  },

  methods: {
    resetData() {
      localStorage.removeItem("activities"); // видалення з localStorage
      this.componentKey++; // оновлюється ключ, щоб примусово перемалювати компонент
    },
  }
};
</script>





<!-- як працює componentKey...

Початкове значення componentKey = 0
Коли компонент вперше монтується, Vue отримує :key="0" і рендерить router-view.

При натисканні кнопки "Скинути"
-викликається resetData()
-localStorage.removeItem("activities") очищає дані
-this.componentKey++ змінює значення, наприклад, на 1
Vue бачить, що ключ змінився
-було key="0", стало key="1"
-для Vue це виглядає, як заміна одного router-view на інший
-Vue знищує старий і створює новий
Компонент ререндериться
-оновлюється візуальна частина, і користувач одразу бачить, що дані очищені без перезавантаження сторінки.

Таким чином, після зміни componentKey відбувається повне "перезавантаження" компонента без оновлення сторінки. -->