const debounce = (callback, dalay) => {//加工为防抖函数
    let timer = 0;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply();
        }, dalay)
    }
}

export  {
    debounce
}
