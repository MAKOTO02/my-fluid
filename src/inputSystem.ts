type Mouse = {
    x: number;
    y: number;
    dx: number;
    dy: number;
    down: boolean;
    scrollDelta: number;
}

export class InputSystem{
    keys: Record<string, boolean>
    mouse: Mouse;
    constructor(canvas : HTMLCanvasElement) {  
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            down: false,
            scrollDelta: 0,
        };

        window.addEventListener('keydown', (e) => {
            this.keys[e.key]= true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.dx += e.movementX;
            this.mouse.dy += e.movementY;
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) / rect.width;   // [0,1]
            this.mouse.y = (e.clientY - rect.top) / rect.height;
        });

        window.addEventListener('mousedown', () => {
            this.mouse.down = true;
        });

        window.addEventListener('mouseup', () => {
            this.mouse.down = false;
        });
        window.addEventListener('wheel', (e) => {
            // deltaY > 0: 下スクロール、deltaY < 0: 上スクロール
            this.mouse.scrollDelta += -e.deltaY / 100; // 上スクロールを正方向に
            e.preventDefault(); // スクロールによるページ移動を防止（必要に応じて）
        }, { passive: false });
    }

    isKeyDown(key: string) {
        return !!this.keys[key];
    }

    resetMouseDelta() {
        this.mouse.dx = 0;
        this.mouse.dy = 0;
    }
  
    resetScroll(){
        this.mouse.scrollDelta = 0;
    }
}