<template>
    <header class="header">
        <div class="logo">
            <img class="logo-img" src="/LogoTime.png">
            <span class="logo-span">TimeWise</span>
        </div>

        <nav class="nav-items">
            <ul>
                <li><router-link to="/reports" class="menu-item">Звітність</router-link></li>  
                <!-- Користувач натискає "Звітність" у меню (router-link to="/reports")
                Vue Router оновлює маршрут (переключає URL на /reports)
                router-view замінює компонент на → ActivityReports.vue
                Відображається компонент ActivityReports.vue, у якому є таблиця з даними -->
                <li class="dropdown menu-item">
                    Налаштування &bigtriangledown;
                    <ul class="dropdown-menu">
                        <li @click="resetData()" class="reset-button">Скинути дані</li>
                    </ul>
                </li>
                <li class="dropdown menu-item">
                    Контакти &bigtriangledown;
                    <ul class="dropdown-menu">
                        <li>
                            <p><strong>Адреса:</strong> Київ, Україна<br>
                               <strong>Телефон:</strong> +380 99 999 99 99<br>
                               <strong>E mail:</strong> timewise@email.com</p>
                        </li>
                    </ul>
                </li>
                <li class="menu-item">FAQ</li>
            </ul>
            <div class="language-switcher">
                <span class="lang-option active">UK</span> | <span class="lang-option">EN</span>
            </div>
        </nav>
    </header>
</template>

<script>
export default {
    props: {
  resetData: Function
}
}
</script>

<style scoped>
.header {
    background-color: black;
    height: 108px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    text-decoration: none;
    padding: 0 85px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1000;
}
.logo {
    display: flex;
    gap: 15px;
}
.logo-img {
    width: 100px;
}
.logo-span {
    color: white;
    font-family: 'Allura';
    font-size: 70px;
    cursor: default;
    margin-top: 15px;
}
.nav-items {
    display: flex;
    align-items: center;
}
.nav-items ul {
    display: flex;
    gap: 90px;
    list-style: none;
    padding: 0;
    margin: 0;
}
.menu-item {
    font-family: 'Montserrat';
    color: white;
    text-decoration: none;
    transition: color 0.3s ease, transform 0.2s ease;
    cursor: pointer;
}
.menu-item:hover {
    color: rgb(186, 186, 186);
    transform: scale(1.05);
}
.dropdown {
    position: relative;
    cursor: pointer;
}
.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: rgb(186, 186, 186);
    list-style: none;
    padding: 10px;
    margin: 0;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.3s ease;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
}
.dropdown:hover .dropdown-menu {
    visibility: visible;
    opacity: 1;
}
.language-switcher {
    margin-left: 20px;
    font-family: 'Montserrat';
    color: white;
    cursor: pointer;
}
.lang-option {
    padding: 5px;
    transition: color 0.3s ease;
}
.lang-option:hover {
    color: rgb(186, 186, 186);
}
.active {
    font-weight: bold;
    text-decoration: underline;
}
.dropdown-menu li p {
    margin: 5px 0;
    color: black;
    font-family: 'Montserrat';
    font-size: 14px;
    border: none;
    padding: 0;
}
.dropdown-menu li p strong {
    font-weight: bold;
    margin-right: 5px;
}

.dropdown-menu li {
    background-color: rgb(91, 89, 89);
    padding: 8px 12px;
    cursor: pointer;
    font-family: 'Montserrat';
    font-size: 16px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    white-space: nowrap; /* перенос тексту на новий рядок */
}
.dropdown-menu li:hover {
    background-color: rgb(162, 162, 162);
}
.reset-button{
    background-color: rgb(91, 89, 89) !important;
}
.reset-button:hover {
    background-color: rgb(138, 36, 36) !important;
}
</style>
