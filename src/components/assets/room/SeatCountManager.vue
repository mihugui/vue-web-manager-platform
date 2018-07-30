<template>
    <div>
        <div>
            <div id="homeChart" :style="{width: '600px', height: '500px'}"></div>
        </div>
    </div>
</template>

<script>
    import echarts from "echarts"

    export default {
        name: "SeatCountManager.vue",
        data(){
            return{
                msg: '欢迎来到家'
            }
        },
        mounted(){
            var myChart = echarts.init(document.getElementById('homeChart'));
            // 基于准备好的dom，初始化echarts实例
            myChart.setOption({
                title: {
                    text: '空间状态占比',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                //color: ['#9bbb59','#co5o4d','#4f81bd'],
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['租用','自用','空闲']
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data:[
                            {value:60, name:'租用'},
                            {value:30, name:'自用'},
                            {value:10, name:'空闲'},
                        ],
                        itemStyle: {
                            normal:{
                                label:{
                                    show:true,
                                    formatter: '{b} : {c} \n ({d}%)'
                                },
                                labelLine:{
                                    show:true
                                }
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ],

            });
        }
    }
</script>

<style >

</style>
