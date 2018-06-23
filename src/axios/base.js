
export const base ={

    toNum:function(data){
        var dataStr=data;//原始字符串
        var dataStrArr=dataStr.split(",");//分割成字符串数组
        var dataIntArr=[];//保存转换后的整型字符串
        dataIntArr = dataStrArr.map(function(data){
            return +data;
        });
        return dataIntArr;
    },

}
