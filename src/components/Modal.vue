<template>
  <div class="modal">
      <div class="modal-content">
          <slot></slot>
      </div>
  </div>
</template>

<script>
export default {
 name: 'Modal',
    props:['loadModal'],
    data(){
        return {
            fns : ""
        }
    }
}
</script>

<style>
.modal{
    width: 100vw;
    position: fixed;
    z-index: 1;
    top:0;
    left: 0;
    height: 100vh;
    background-color: rgba(54, 48, 48, 0.4); 
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto; 
    padding: 5px;
    border: none;
    width: 40%; 
    min-width: 350px;
    border-radius: 15px;
}

</style>