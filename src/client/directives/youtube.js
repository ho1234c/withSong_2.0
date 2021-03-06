export default class Youtube {
    constructor($window) {
        this.$window = $window;
        this.template = '<div></div>';
        this.restrict = 'E';
        this.scope = {
            height: "@",
            width: "@",
            videoid: "@",
            volume: "@",
            isMuted: "@"
        };
    }
    link(scope, element) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";

        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        let player;

        this.$window.onYouTubeIframeAPIReady = () => {
            player = new YT.Player(element.children()[0], {
                height: scope.height,
                width: scope.width,
                videoId: scope.videoid,
                disablekb: 1, // user can manipulate player through keyboard
                events: {
                    'onReady': event => {
                        event.target.playVideo();
                        if(event.target.isMuted()){
                            event.target.unMute();
                        }
                    },
                    'onStateChange': event => {
                        // When finished find the next video.
                        if (event.data == YT.PlayerState.ENDED) {
                            scope.$apply(() => {
                                scope.$emit('videoEnd');
                            });
                        }
                    },
                    'onError': event => {
                        scope.$apply(() => {
                                scope.$emit('videoEnd');
                            });
                    }
                }
            });
        };

        scope.$watch('videoid', (newValue, oldValue) => {
            if (newValue == oldValue) {
                return;
            }
            player.loadVideoById(scope.videoid);
        });

        scope.$watch('height + width', (newValue, oldValue) => {
            if (newValue == oldValue) {
                return;
            }
            player.setSize(scope.width, scope.height);
        });

        scope.$watch('volume', (newValue, oldValue) => {
            if(newValue == oldValue){
                return;
            }
    
            player.setVolume(scope.volume);
        });

        scope.$watch('isMuted', (newValue, oldValue) => {
            if(!player){
                return;
            }
            
            // passed "isMuted" as boolean but received as string
            if(scope.isMuted == "true"){
                player.mute();
            }else{
                player.unMute();
            }
        });
    }
}

Youtube.$inject = ['$window'];