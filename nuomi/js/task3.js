function Observer(data) {
    this.data = data;
    this.walk(data);
    this.events = {};
}

//遍历
Observer.prototype.walk = function (obj) {
    let val,
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
    let _this = this;
    Object.defineProperty(this.data, key, {
        configurable: true,
        enumerable: true,
        get: function () {
            console.log("你访问了 " + key);
            return val;
        },
        set: function (newVal) {
            console.log("你设置了 " + key + "，新的值" + key + "=" + JSON.stringify(newVal));

            //触发$watch函数
            _this.emit(key, val, newVal);
            val = newVal;

            // 如果设置的新值是一个对象，则递归它，加上set/get
            if(typeof newVal ==="object"){
                new Observer(newVal);
            }
        }
    })
};

// 将所监听事件及其回调函数添加到events对象
Observer.prototype.$watch = function(key, listener) {
    if(!this.events[key]){
        this.events[key] = [];
    };
    this.events[key].push(listener);
};

Observer.prototype.emit = function(attr, ...arg) {
    this.events[attr] && this.events[attr].forEach(function (item) {
        item(...arg);
    });
};

//问题1和2的测试用例
let app1 = new Observer({
    name: 'youngwind',
    age: 25
});

app1.data.name = {
    lastName: 'liang',
    firstName: 'shaofeng'
};

app1.data.name.lastName;
// 这里还需要输出 '你访问了 lastName '
app1.data.name.firstName = 'lalala';
// 这里还需要输出 '你设置了firstName, 新的值为 lalala'



// 问题3的测试用例
let app2 = new Observer({
    name: 'youngwind',
    age: 25
});

// 你需要实现 $watch 这个 API
app2.$watch('age', function(age) {
    console.log(`我的年纪变了，现在已经是：${age}岁了`)
});

app2.data.age = 100; // 输出：'我的年纪变了，现在已经是100岁了'