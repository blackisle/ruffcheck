const os = require('os');
const SerialPort = require("serialport");

var result
getSerialList()


function confirm_serialResetSystem() {
    if (confirm("确定板卡重置吗？")) {
        if (confirm("此操作将会清除开发板上的设置和数据。")) {
            progressDisplay('scroll-tab-4-progress')
            document.getElementById('scroll-tab-4-output').innerHTML = ''
            serialResetSystem()
        } else {
            alert("取消板卡重置")
            progressDisplayNone('scroll-tab-4-progress')
            document.getElementById('scroll-tab-4-output').innerHTML = ''
        }
    } else {
        alert("取消板卡重置");
        progressDisplayNone('scroll-tab-4-progress')
        document.getElementById('scroll-tab-4-output').innerHTML = ''
    }
}

function confirm_resetGetBootLog() {
    if (confirm("获取开机日志需要重启开发板")) {
        if (confirm("点击确定后，按下开发板上的红色 HRESET 按钮，整个过程需要大约 2 分钟")) {
            progressDisplay('scroll-tab-5-progress')
            document.getElementById('scroll-tab-5-output').innerHTML = ''
            serialGetBootLog()
        } else {
            alert("取消");
            document.getElementById('scroll-tab-5-output').innerHTML = ''
        }
    } else {
        alert("取消");
        document.getElementById('scroll-tab-5-output').innerHTML = ''
    }
}

function serialResetSystem() {
    setTimeout(function () {
        var port = new SerialPort(
            selectSerial, {
                baudRate: 57600, //波特率
                dataBits: 8, //数据位
                parity: 'none', //奇偶校验
                stopBits: 1, //停止位
                flowControl: false
            });
        var output = ''
        port.on('data', function (data) {
            output = output.concat(data.toString())
        });

        port.on('open', function () {
            port.write(' \n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
            port.write('jffs2reset -y && reboot &\n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
        });

        setTimeout(function () {
            var re = /Linux.version.3.18.21/;
            var result = output.match(re)[0]

            if (result == null) {
                progressDisplayNone('scroll-tab-4-progress');
                document.getElementById('scroll-tab-4-output').innerHTML = '重试一次';
                port.close();
            }
            else {
                progressDisplayNone('scroll-tab-4-progress');
                document.getElementById('scroll-tab-4-output').innerHTML = '重置成功';
                port.close();
            }
        }, 15000)

    }, 4000);
}

function getSerialList() {
    var SerialPort = require('serialport');
    SerialPort.list(function (err, ports) {
        var serialList = []
        ports.forEach(function (port) {
            serialList.push(port.comName)
        });

        serialList.forEach(function (serial) {
            $('#selectSerialList').append('<option value=' + serial + '>' + serial + '</option>')
        })
    });
}

function serialGetVersion() {
    setTimeout(function () {
        var port = new SerialPort(
            selectSerial, {
                baudRate: 57600, //波特率
                dataBits: 8, //数据位
                parity: 'none', //奇偶校验
                stopBits: 1, //停止位
                flowControl: false
            });

        var output = ''
        port.on('data', function (data) {
            output = output.concat(data.toString())
        });


        port.on('open', function () {
            port.write(' \n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
            port.write('cat /etc/ruff_version\n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
        });

        setTimeout(function () {
            var re = /\d\.\d\.\d/g;
            var result = output.match(re)[0]

            if (result ==null) {
                // progressDisplayNone('scroll-tab-1-progress')
                document.getElementById('scroll-tab-7-output-version').innerHTML = '<h1>' + '重试一次' + '</h1>'
                // progressDisplay('scroll-tab-1-output')

                port.close()
            }
            else {
                // progressDisplayNone('scroll-tab-1-progress')
                document.getElementById('scroll-tab-7-output-version').innerHTML = '<h1>系统版本：' + result + '</h1>'
                // progressDisplay('scroll-tab-1-output')

                port.close()
            }
        }, 1000)

    }, 1000);
}

function serialGetWiFi() {
    setTimeout(function () {
        var port = new SerialPort(
            selectSerial, {
                baudRate: 57600, //波特率
                dataBits: 8, //数据位
                parity: 'none', //奇偶校验
                stopBits: 1, //停止位
                flowControl: false
            });

        var output = '';
        port.on('data', function (data) {
            output = output.concat(data.toString());
        });


        port.on('open', function () {
            port.write(' \n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
            port.write('ifconfig\n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
        });

        setTimeout(function () {
            var re = /wlan0\s[\s\S]*?inet addr:([\d.]*)/;
            var result = output.match(re)[1]

            if (result == null) {
                // progressDisplayNone('scroll-tab-2-progress')
                document.getElementById('scroll-tab-7-output-wifi').innerHTML = '<h1>' + 'WiFi：重试一次' + '</h1>'
                // progressDisplay('scroll-tab-2-output')
                port.close()
            }
            else if (result == '192.168.78.1') {
                // progressDisplayNone('scroll-tab-2-progress')
                document.getElementById('scroll-tab-7-output-wifi').innerHTML = '<h1>' + 'WiFi：未配置' + '</h1>'
                // progressDisplay('scroll-tab-2-output')
                port.close()
            }
            else {
                // progressDisplayNone('scroll-tab-2-progress')
                document.getElementById('scroll-tab-7-output-wifi').innerHTML = '<h1>WiFi 地址：' + result + '</h1>'
                // progressDisplay('scroll-tab-2-output')
                port.close()
            }
        }, 1000)

    }, 1000);
}


function serialGetEthernet() {
    setTimeout(function () {
        var port = new SerialPort(
            selectSerial, {
                baudRate: 57600, //波特率
                dataBits: 8, //数据位
                parity: 'none', //奇偶校验
                stopBits: 1, //停止位
                flowControl: false
            });
        var output = ''
        port.on('data', function (data) {
            output = output.concat(data.toString())
        });

        port.on('open', function () {
            port.write(' \n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
            port.write('ifconfig\n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
        });

        setTimeout(function () {
            var re = /eth0.2\s[\s\S]{0,100}inet addr:([\d.]*)/;

            if (output.match(re) == null) {
                // progressDisplayNone('scroll-tab-3-progress')
                document.getElementById('scroll-tab-7-output-ethernet').innerHTML ='<h1>' + '以太网：未连接' + '</h1>'
                // progressDisplay('scroll-tab-3-output')
                port.close()
            }
            else {
                // progressDisplayNone('scroll-tab-3-progress')
                document.getElementById('scroll-tab-7-output-ethernet').innerHTML ='<h1>以太网 IP 地址：' + output.match(re)[1] + '</h1>'
                // progressDisplay('scroll-tab-3-output')
                port.close()
            }
        }, 1000)

    }, 1000);
}


function serialGetLog() {
    setTimeout(function () {
        var port = new SerialPort(
            selectSerial, {
                baudRate: 57600, //波特率
                dataBits: 8, //数据位
                parity: 'none', //奇偶校验
                stopBits: 1, //停止位
                flowControl: false
            });
        var output = ''

        port.on('data', function (data) {
            output = output.concat(data.toString())
        });

        port.on('open', function () {
            port.write(' \n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
            port.write('dmesg\n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
            setTimeout(function () {
                port.write('logread\n', function (err) {
                    if (err) {
                        return console.log('Error on write: ', err.message);
                    }
                });
            }, 3000);
        });

        setTimeout(function () {
            progressDisplayNone('scroll-tab-5-progress')
            document.getElementById('scroll-tab-5-output').innerText = output
            progressDisplay('scroll-tab-5-output')
            port.close()
        }, 10000)

    }, 1000);
}

function serialGetBootLog() {
    setTimeout(function () {
        var port = new SerialPort(
            selectSerial, {
                baudRate: 57600, //波特率
                dataBits: 8, //数据位
                parity: 'none', //奇偶校验
                stopBits: 1, //停止位
                flowControl: false
            });
        var output = ''

        port.on('data', function (data) {
            output = output.concat(data.toString())
        });

        setTimeout(function () {
            progressDisplayNone('scroll-tab-5-progress')
            document.getElementById('scroll-tab-5-output').innerText = output
            progressDisplay('scroll-tab-5-output')
            port.close()
        }, 120000)
    }, 1000);
}

function serialGetInfo() {
    serialGetVersion()

    setTimeout(function(){
        serialGetWiFi()
    }, 5000)

    setTimeout(function(){
        serialGetEthernet()
    }, 10000)

    setTimeout(function(){
        progressDisplay('scroll-tab-7-output')
        progressDisplayNone('scroll-tab-7-progress')
    }, 15000)
}