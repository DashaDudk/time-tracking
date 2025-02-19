<template>
    <div class="icons">
        <img src="/play.png" alt="Почати" @click="() => StartTimer(index)" class="icon"/>
        <img src="/stop.png" alt="Зупинити" @click="() => StopTimer(index)" class="icon" />
    </div>
    
</template>

<script>
    export default{
        props:{
            activity:{
                type: Object,
                required: true
            },
            StartTimer:{
                type: Function,
                required: true
            },
            StopTimer:{
                type: Function,
                required: true
            },
            index: {
                type: Number,
                required: true
            }
        }
    }
</script>

<style scoped>
.icons{
    display: flex;
    margin: 0;
    padding: 0;
    gap: 18px;
    width: 30px;
    height: 30px;
    position: absolute;
    left: 600px;
}
.icon:hover{
    transform: scale(1.05) ;
}
</style>