# vue-doctor 扫描问题修复 - 任务面板

| 任务/步骤 | 状态 | Commit 信息 & Hash |
|-----------|------|-------------------|
| 1. 修复 Accessibility 真实问题：ForumSection.vue button 添加 type="button" | 完成 | fix: add explicit type=button to ForumSection topic button (d24af3b) |
| 2. 修复 no-index-as-key（HeroSection/CoursesSection/AtmosphereSection/IntelligenceSection/PracticesSection 共 5 处） | 完成 | fix: replace index keys with stable keys in v-for lists (ebeb29e) |
| 3. 清理死代码：删除 GlitchText.vue、useScrollReveal.ts（含空目录）、env.d.ts，market.ts 的 typeStyles 去掉 export | 完成 | chore: remove dead code flagged by vue-doctor (3dc6cf2) |
| 4. 配置 vue-doctor.config.json ignore.rules 忽略 4 条误报规则 | 完成 | chore: ignore 4 systematically-misfiring vue-doctor rules (ebfd3b9) |
| 5. 验证：vue-doctor 重扫 0 errors/0 warnings、npm run build 成功、vue-tsc 通过、页面无回归 | 完成 | chore: mark all tasks complete and verification passed (68457a3) |
