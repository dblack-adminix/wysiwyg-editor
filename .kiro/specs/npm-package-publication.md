# NPM Package Publication Specification

## Overview
Prepare the WYSIWYG editor project for publication as an npm package to enable easy integration into other React projects.

## User Stories

### US-1: Package Configuration
**As a** package maintainer  
**I want** proper package.json configuration  
**So that** the package can be published and consumed correctly

**Acceptance Criteria:**
- [ ] Package name follows npm naming conventions (scoped or unscoped)
- [ ] Version follows semantic versioning (1.0.0)
- [ ] Main entry points are correctly configured (main, module, types, exports)
- [ ] Files array includes only necessary distribution files
- [ ] PeerDependencies are correctly specified (React 18+)
- [ ] Dependencies include runtime requirements (shiki, html2canvas, jspdf)
- [ ] Keywords are relevant for discoverability
- [ ] Repository, bugs, and homepage URLs are included
- [ ] License is specified (MIT)
- [ ] Author information is included

### US-2: Build Configuration
**As a** package maintainer  
**I want** proper build configuration for library mode  
**So that** the package builds correctly for distribution

**Acceptance Criteria:**
- [ ] Vite is configured for library mode (not app mode)
- [ ] Entry point is src/index.ts
- [ ] External dependencies (React, ReactDOM) are not bundled
- [ ] Multiple output formats are generated (ESM, CJS)
- [ ] TypeScript declarations (.d.ts) are generated
- [ ] CSS is properly bundled or exported
- [ ] Source maps are included for debugging

### US-3: Comprehensive Documentation
**As a** developer integrating the package  
**I want** clear and comprehensive documentation  
**So that** I can quickly understand and use the editor

**Acceptance Criteria:**
- [ ] README includes installation instructions for npm/yarn/pnpm
- [ ] Quick start examples for basic usage
- [ ] Controlled and uncontrolled mode examples
- [ ] Complete API reference for all props
- [ ] Hook usage examples (useWysiwygEditor)
- [ ] Headless core usage examples (EditorCore)
- [ ] Customization guide (CSS, themes, styling)
- [ ] Integration examples for popular frameworks (Next.js, Vite, CRA)
- [ ] Code detection feature documentation
- [ ] Shiki syntax highlighting documentation
- [ ] Troubleshooting section
- [ ] Migration guide (if applicable)
- [ ] Contributing guidelines

### US-4: TypeScript Support
**As a** TypeScript developer  
**I want** full type definitions  
**So that** I get autocomplete and type safety

**Acceptance Criteria:**
- [ ] All exported components have type definitions
- [ ] All exported hooks have type definitions
- [ ] All exported utilities have type definitions
- [ ] Types are exported from main entry point
- [ ] Generic types are properly constrained
- [ ] JSDoc comments for better IDE hints

### US-5: CSS Handling
**As a** developer integrating the package  
**I want** easy CSS import  
**So that** styling works out of the box

**Acceptance Criteria:**
- [ ] CSS is bundled with the package
- [ ] CSS import path is documented
- [ ] CSS modules are properly handled
- [ ] Theme variables are documented
- [ ] CSS customization guide is provided
- [ ] No CSS conflicts with host application

### US-6: Framework Integration Examples
**As a** developer using different frameworks  
**I want** framework-specific examples  
**So that** I can integrate easily into my project

**Acceptance Criteria:**
- [ ] Next.js integration example (App Router)
- [ ] Next.js integration example (Pages Router)
- [ ] Vite + React integration example
- [ ] Create React App integration example
- [ ] Remix integration example (optional)
- [ ] SSR considerations documented

### US-7: Minimal Configuration Example
**As a** developer wanting a simple editor  
**I want** a minimal configuration example  
**So that** I can use only essential features

**Acceptance Criteria:**
- [ ] Example with minimal props
- [ ] Example disabling advanced features
- [ ] Example for mobile-only usage
- [ ] Example for read-only display

### US-8: Advanced Usage Examples
**As a** developer needing advanced features  
**I want** comprehensive examples  
**So that** I can implement complex use cases

**Acceptance Criteria:**
- [ ] Form integration example
- [ ] Validation example
- [ ] Custom toolbar configuration
- [ ] Image upload handler example
- [ ] Video upload handler example
- [ ] Autosave with backend sync
- [ ] Multi-editor instance management

### US-9: Package Publishing Checklist
**As a** package maintainer  
**I want** a publishing checklist  
**So that** I don't miss any steps

**Acceptance Criteria:**
- [ ] Build passes without errors
- [ ] Tests pass
- [ ] TypeScript compilation succeeds
- [ ] Package size is reasonable (<500KB)
- [ ] README is complete
- [ ] CHANGELOG is updated
- [ ] Version is bumped appropriately
- [ ] Git tags are created
- [ ] npm publish dry-run succeeds
- [ ] Package is published to npm registry

### US-10: Post-Publication Verification
**As a** package maintainer  
**I want** to verify the published package  
**So that** I ensure it works correctly

**Acceptance Criteria:**
- [ ] Package can be installed via npm
- [ ] Package works in a fresh React project
- [ ] TypeScript types are available
- [ ] CSS imports work correctly
- [ ] All exports are accessible
- [ ] Documentation links work
- [ ] npm page displays correctly

## Technical Requirements

### Package Structure
```
@your-org/wysiwyg-editor/
├── dist/
│   ├── index.js           # CJS bundle
│   ├── index.esm.js       # ESM bundle
│   ├── index.d.ts         # TypeScript declarations
│   ├── style.css          # Bundled CSS
│   └── *.map              # Source maps
├── src/                   # Source code (not published)
├── README.md              # Documentation
├── LICENSE                # MIT License
├── CHANGELOG.md           # Version history
└── package.json           # Package metadata
```

### Package.json Exports Field
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./style.css": "./dist/style.css"
  }
}
```

### Peer Dependencies
- react: ^18.0.0
- react-dom: ^18.0.0

### Dependencies
- shiki: ^3.21.0 (syntax highlighting)
- html2canvas: ^1.4.1 (PDF generation)
- jspdf: ^4.0.0 (PDF generation)

### Dev Dependencies
- TypeScript
- Vite
- React types
- Testing libraries
- ESLint

## Implementation Tasks

### Phase 1: Package Configuration
1. Update package.json with correct metadata
2. Add exports field for modern module resolution
3. Add repository, bugs, homepage URLs
4. Add author and license information
5. Review and update keywords

### Phase 2: Build Configuration
1. Verify Vite library mode configuration
2. Ensure TypeScript declarations are generated
3. Configure CSS bundling
4. Test build output
5. Verify external dependencies are not bundled

### Phase 3: Documentation
1. Update README with installation instructions
2. Add quick start examples
3. Document all props and types
4. Add framework integration examples
5. Create troubleshooting section
6. Add code detection documentation
7. Add Shiki highlighting documentation

### Phase 4: Examples
1. Create minimal configuration example
2. Create form integration example
3. Create validation example
4. Create custom upload handler examples
5. Create Next.js integration example
6. Create Vite integration example

### Phase 5: Testing & Verification
1. Run build and verify output
2. Test in fresh React project
3. Verify TypeScript types work
4. Test CSS imports
5. Check package size
6. Run npm publish --dry-run

### Phase 6: Publication
1. Update CHANGELOG
2. Bump version
3. Create git tag
4. Publish to npm
5. Verify published package
6. Update documentation links

## Success Metrics
- Package successfully published to npm
- Package can be installed and used in fresh projects
- Documentation is clear and comprehensive
- TypeScript types work correctly
- No breaking issues reported in first week
- Package size is under 500KB
- Build time is under 30 seconds

## Dependencies
- None (standalone package)

## Risks & Mitigations
- **Risk:** CSS conflicts with host application  
  **Mitigation:** Use CSS modules and scoped class names

- **Risk:** Large bundle size  
  **Mitigation:** Externalize React, use tree-shaking, analyze bundle

- **Risk:** TypeScript types not working  
  **Mitigation:** Test types in separate project, use tsc --noEmit

- **Risk:** Breaking changes in dependencies  
  **Mitigation:** Lock dependency versions, test before publishing

## Notes
- Package name should be decided (scoped vs unscoped)
- Consider adding GitHub Actions for automated publishing
- Consider adding badges to README (npm version, downloads, license)
- Consider creating a demo site (GitHub Pages or Vercel)
- Consider adding Storybook for component documentation
