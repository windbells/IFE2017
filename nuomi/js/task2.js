function Observer(data) {
    this.data = data;
    this.walk(data);
}

//遍历
Observer.prototype.walk = function (obj) {
    var val,
        _this = this;
    Object.keys(obj).forEach(function (key) {
        val = obj[key];
        if (typeof val == "object") {
            new Observer(val);
        }
        _this.convert(key, val);
    })
};

Observer.prototype.convert = function (key, val) {
    Object.defineProperty(this.data, key, {
        configurable: true,
        enumerable: true,
        get: function () {
            console.log("你访问了 " + key);
            return val;
        },
        set: function (newVal) {
            console.log("你设置了 " + key + "，新的值" + key + "=" + newVal);

            // 如果设置的新值是一个对象，则递归它，加上set/get
            if(typeof newVal ==="object"){
                new Observer(newVal);
            }
            val = newVal;
        }
    })
};

let app1 = new Observer({
    name: 'youngwind',
    age: 25
});

let app2 = new Observer({
    university: 'bupt',
    major: 'computer'
});

// 要实现的结果如下：
app1.data.name; // 你访问了 name
app1.data.age = 100;  // 你设置了 age，新的值为100
app2.data.university ;// 你访问了 university
app2.data.major = 'science';  // 你设置了 major，新的值为 science

