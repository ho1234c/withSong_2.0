export default class listCtrl {
    constructor($rootScope, initList, Player, List) {
        angular.extend(this, {$rootScope, initList, Player, List});

        // only first time
        if(this.List.musicList.length === 0){
            this.List.musicList = initList.data;
        }

        // for highlighting control
        this.isSelectedList = this.List.selectedIndex;
        this.isSelectedSong = this.Player.status.listName == 'listDetail' ? this.Player.status.listIndex : null;

        this.$rootScope.$on('highlighting', (event, msg) => {
            if(msg.index === -1){
                this.isSelectedSong = null;
            }
            else{
                if(msg.listname == 'listDetail'){
                    this.isSelectedSong = msg.index;
                }
                else {
                    this.isSelectedSong = null;
                }
            }
        });
    }
    watchMore(order){
        this.List.loadList(this.List.musicList.length, order)
            .then(result => {
                for(const obj of result.data){
                    this.List.musicList.push(obj);
                }
            });
    }
    selectList(id, index){
        this.isSelectedSong = null;

        // init status
        this.Player.listDetail = [];
        this.Player.listDetailCurrentPage = 1;
        this.Player.status.musicListId = id;

        // for highlighting
        this.List.selectedIndex = index;
        this.isSelectedList = index;

        this.Player.highlighting(this.Player.status.listIndex, this.Player.status.listName);

        this.List.loadSong(id)
            .then(result => {
                const songInfo = JSON.parse(result.data.songInfo);
                for(const obj of songInfo){
                    this.Player.listDetail.push(obj);
                }
            });
    }
    listenList(id){
        this.Player.playlistCurrentPage = 1;
        this.Player.playlist = [];

        this.List.loadSong(id)
            .then(result => {
                const songInfo = JSON.parse(result.data.songInfo);
                for(const obj of songInfo){
                    this.Player.playlist.push(obj);
                }
            });
    }
    changeListOrder(){
        this.List.musicList = [];
        this.List.loadList()
            .then(result => {
                for(const obj of result.data){
                    this.List.musicList.push(obj);
                }
            });
    }

}

listCtrl.$inject = ['$rootScope', 'initList', 'Player', 'List'];

