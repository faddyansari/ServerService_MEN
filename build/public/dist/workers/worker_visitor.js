addEventListener('message', ({ data }) => {
    let response = `worker response to ${data}`;
    // console.log('Got Message in Worker', data);
    switch (data.action) {
        case 'updateUser':
            let prevItems = [];
            let newItems = [];
            let keys = {};
            Object.keys(data.data).map(value => {
                data.visitorList = data.visitorList.filter((item) => {
                    // console.log('Session : ', data.data[value].session);
                    if (data.data[value].id == item.id) {
                        prevItems.unshift(item);
                        newItems.push(data.data[value].session);
                    }
                    return item.id != data.data[value].id;
                });
                data.visitorList.unshift(data.data[value].session);
            });

            postMessage({ action: 'updateUser', visitorList: data.visitorList, unsetItems: prevItems, newItems: newItems });
            break;
        default:
            postMessage(data);
            break;
    }
    return;
});