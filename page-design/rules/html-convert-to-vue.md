1. 对应页面需要前往`src/pages`新建一个同名目录，这个目录下存放页面的主体`Index.vue`,以及根据相关design.md或者plan.md得到的子组件；例如`forum.html`，若`forum-plan.md`中有提到这个页面产生了子组件`SubComponent1.vue`,`SubComponent2.vue`等，那么对应组件应该被放置在 `src/pages/forum` 下，当然页面主体叫 `Index.vue`。
2. 这个阶段可以不用严格遵守项目根目录下的`CLAUDE.md`中的开发规定，但是要保证最起码的'plan-progress-commit'loop
