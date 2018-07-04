<template>
    <div>
        <link rel="import" href="http://117.159.206.248:20888/consume/#/consumption/consumptionReport">
    </div>
</template>
<script>
    export default {
        name: 'importUrl',
        data() {
            return {

            }
        },

        methods:{
            importurl:function(){
                var link = document.createElement('link');
                link.rel = 'import';
                link.href = 'http://117.159.206.248:20888/consume/#/consumption/consumptionReport'
                document.head.appendChild(link);
            }
        },

        mounted(){
        }
    }


</script>
<style>

</style>
