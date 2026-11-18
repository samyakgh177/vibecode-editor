"use client"

import { useRef, useEffect, useCallback } from "react"
import Editor, { type Monaco } from "@monaco-editor/react"
import { TemplateFile } from "../lib/path-to-json"
import { configureMonaco, defaultEditorOptions, getEditorLanguage } from "../lib/editor-config"


export interface EditorInstance {
  getModel: () => any;
  getPosition: () => { lineNumber: number; column: number } | null;
  [key: string]: any;
}

interface PlaygroundEditorProps {
  activeFile: TemplateFile | undefined
  content: string
  onContentChange: (value: string) => void
  suggestion: string | null
  suggestionLoading: boolean
  suggestionPosition: { line: number; column: number } | null
  onAcceptSuggestion: (editor: any, monaco: any) => void
  onRejectSuggestion: (editor: any) => void
  onTriggerSuggestion: (type: string, editor: any) => void
  onMountEditor?: (editor: EditorInstance) => void
}

export const PlaygroundEditor = ({
  activeFile,
  content,
  onContentChange,
  suggestion,
  suggestionLoading,
  suggestionPosition,
  onAcceptSuggestion,
  onRejectSuggestion,
  onTriggerSuggestion,
  onMountEditor,
}: PlaygroundEditorProps) => {
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const inlineCompletionProviderRef = useRef<any>(null)
  const currentSuggestionRef = useRef<{
    text: string
    position: { line: number; column: number }
    id: string
  } | null>(null)
  const isAcceptingSuggestionRef = useRef(false)
  const suggestionAcceptedRef = useRef(false)
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const tabCommandRef = useRef<any>(null)

  // Generate unique ID for each suggestion
  const generateSuggestionId = () => `suggestion-${Date.now()}-${Math.random()}`

  // Create inline completion provider
  const createInlineCompletionProvider = useCallback(
    (monaco: Monaco) => {
      return {
        provideInlineCompletions: async (model: any, position: any, context: any, token: any) => {
          console.log("provideInlineCompletions called", {
            hasSuggestion: !!suggestion,
            hasPosition: !!suggestionPosition,
            currentPos: `${position.lineNumber}:${position.column}`,
            suggestionPos: suggestionPosition ? `${suggestionPosition.line}:${suggestionPosition.column}` : null,
            isAccepting: isAcceptingSuggestionRef.current,
            suggestionAccepted: suggestionAcceptedRef.current,
          })

          // Don't provide completions if we're currently accepting or have already accepted
          if (isAcceptingSuggestionRef.current || suggestionAcceptedRef.current) {
            console.log("Skipping completion - already accepting or accepted")
            return { items: [] }
          }

          // Only provide suggestion if we have one
          if (!suggestion || !suggestionPosition) {
            console.log("No suggestion or position available")
            return { items: [] }
          }

          // Check if current position matches suggestion position (with some tolerance)
          const currentLine = position.lineNumber
          const currentColumn = position.column

          const isPositionMatch =
            currentLine === suggestionPosition.line &&
            currentColumn >= suggestionPosition.column &&
            currentColumn <= suggestionPosition.column + 2 // Small tolerance

          if (!isPositionMatch) {
            console.log("Position mismatch", {
              current: `${currentLine}:${currentColumn}`,
              expected: `${suggestionPosition.line}:${suggestionPosition.column}`,
            })
            return { items: [] }
          }

          const suggestionId = generateSuggestionId()
          currentSuggestionRef.current = {
            text: suggestion,
            position: suggestionPosition,
            id: suggestionId,
          }

          console.log("Providing inline completion", { suggestionId, suggestion: suggestion.substring(0, 50) + "..." })

          // Clean the suggestion text (remove \r characters)
          const cleanSuggestion = suggestion.replace(/\r/g, "")

          return {
            items: [
              {
                insertText: cleanSuggestion,
                range: new monaco.Range(
                  suggestionPosition.line,
                  suggestionPosition.column,
                  suggestionPosition.line,
                  suggestionPosition.column,
                ),
                kind: monaco.languages.CompletionItemKind.Snippet,
                label: "AI Suggestion",
                detail: "AI-generated code suggestion",
                documentation: "Press Tab to accept",
                sortText: "0000", // High priority
                filterText: "",
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              },
            ],
          }
        },
        freeInlineCompletions: (completions: any) => {
          console.log("freeInlineCompletions called")
        },
      }
    },
    [suggestion, suggestionPosition],
  )

  // Clear current suggestion
  const clearCurrentSuggestion = useCallback(() => {
    console.log("Clearing current suggestion")
    currentSuggestionRef.current = null
    suggestionAcceptedRef.current = false
    if (editorRef.current) {
      editorRef.current.trigger("ai", "editor.action.inlineSuggest.hide", null)
    }
  }, [])

  // Accept current suggestion with double-acceptance prevention
  const acceptCurrentSuggestion = useCallback(() => {
    console.log("acceptCurrentSuggestion called", {
      hasEditor: !!editorRef.current,
      hasMonaco: !!monacoRef.current,
      hasSuggestion: !!currentSuggestionRef.current,
      isAccepting: isAcceptingSuggestionRef.current,
      suggestionAccepted: suggestionAcceptedRef.current,
    })

    if (!editorRef.current || !monacoRef.current || !currentSuggestionRef.current) {
      console.log("Cannot accept suggestion - missing refs")
      return false
    }

    // CRITICAL: Prevent double acceptance with immediate flag setting
    if (isAcceptingSuggestionRef.current || suggestionAcceptedRef.current) {
      console.log("BLOCKED: Already accepting/accepted suggestion, skipping")
      return false
    }

    // Set flags IMMEDIATELY to prevent any race conditions
    isAcceptingSuggestionRef.current = true
    suggestionAcceptedRef.current = true

    const editor = editorRef.current
    const monaco = monacoRef.current
    const currentSuggestion = currentSuggestionRef.current || (suggestion && suggestionPosition ? { text: suggestion, position: suggestionPosition } : null)

    if (!editor || !monaco || !currentSuggestion) {
      console.log("Missing editor, monaco, or suggestion to accept")
      isAcceptingSuggestionRef.current = false
      suggestionAcceptedRef.current = false
      return false
    }

    try {
      // Clean the suggestion text (remove \r characters)
      const cleanSuggestionText = currentSuggestion.text.replace(/\r/g, "")

      console.log("ACCEPTING suggestion:", cleanSuggestionText.substring(0, 50) + "...")

      // Get current cursor position to validate
      const currentPosition = editor.getPosition()
      const suggestionPos = currentSuggestion.position

      // Verify we're still at the suggestion position
      if (
        currentPosition.lineNumber !== suggestionPos.line ||
        currentPosition.column < suggestionPos.column ||
        currentPosition.column > suggestionPos.column + 5
      ) {
        console.log("Position changed, cannot accept suggestion")
        return false
      }

      // Insert the suggestion text at the correct position
      const range = new monaco.Range(suggestionPos.line, suggestionPos.column, suggestionPos.line, suggestionPos.column)

      // Use executeEdits to insert the text
      const success = editor.executeEdits("ai-suggestion-accept", [
        {
          range: range,
          text: cleanSuggestionText,
          forceMoveMarkers: true,
        },
      ])

      if (!success) {
        console.error("Failed to execute edit")
        return false
      }

      // Calculate new cursor position
      const lines = cleanSuggestionText.split("\n")
      const endLine = suggestionPos.line + lines.length - 1
      const endColumn =
        lines.length === 1 ? suggestionPos.column + cleanSuggestionText.length : lines[lines.length - 1].length + 1

      // Move cursor to end of inserted text
      editor.setPosition({ lineNumber: endLine, column: endColumn })

      console.log("SUCCESS: Suggestion accepted, new position:", `${endLine}:${endColumn}`)

      // Clear the suggestion
      clearCurrentSuggestion()

      // Call the parent's accept handler
      onAcceptSuggestion(editor, monaco)

      return true
    } catch (error) {
      console.error("Error accepting suggestion:", error)
      return false
    } finally {
      // Reset accepting flag immediately
      isAcceptingSuggestionRef.current = false

      // Keep accepted flag for longer to prevent immediate re-acceptance
      setTimeout(() => {
        suggestionAcceptedRef.current = false
        console.log("Reset suggestionAcceptedRef flag")
      }, 1000) // Increased delay to 1 second
    }
  }, [clearCurrentSuggestion, onAcceptSuggestion])

  // Check if there's an active inline suggestion at current position
  const hasActiveSuggestionAtPosition = useCallback(() => {
    if (!editorRef.current || !currentSuggestionRef.current) return false

    const position = editorRef.current.getPosition()
    const suggestion = currentSuggestionRef.current

    return (
      position.lineNumber === suggestion.position.line &&
      position.column >= suggestion.position.column &&
      position.column <= suggestion.position.column + 2
    )
  }, [])

  // Update inline completions when suggestion changes
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return

    const editor = editorRef.current
    const monaco = monacoRef.current

    console.log("Suggestion changed", {
      hasSuggestion: !!suggestion,
      hasPosition: !!suggestionPosition,
      isAccepting: isAcceptingSuggestionRef.current,
      suggestionAccepted: suggestionAcceptedRef.current,
    })

    // Don't update if we're in the middle of accepting a suggestion
    if (isAcceptingSuggestionRef.current || suggestionAcceptedRef.current) {
      console.log("Skipping update - currently accepting/accepted suggestion")
      return
    }

    // Dispose previous provider
    if (inlineCompletionProviderRef.current) {
      inlineCompletionProviderRef.current.dispose()
      inlineCompletionProviderRef.current = null
    }

    // Clear current suggestion reference
    currentSuggestionRef.current = null

    // Register new provider if we have a suggestion
    if (suggestion && suggestionPosition) {
      console.log("Registering new inline completion provider")

      const language = getEditorLanguage(activeFile?.fileExtension || "")
      const provider = createInlineCompletionProvider(monaco)

      inlineCompletionProviderRef.current = monaco.languages.registerInlineCompletionsProvider(language, provider)

      // Small delay to ensure editor is ready, then trigger suggestions
      setTimeout(() => {
        if (editorRef.current && !isAcceptingSuggestionRef.current && !suggestionAcceptedRef.current) {
          console.log("Triggering inline suggestions")
          editor.trigger("ai", "editor.action.inlineSuggest.trigger", null)
        }
      }, 50)
    }

    return () => {
      if (inlineCompletionProviderRef.current) {
        inlineCompletionProviderRef.current.dispose()
        inlineCompletionProviderRef.current = null
      }
    }
  }, [suggestion, suggestionPosition, activeFile, createInlineCompletionProvider])

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
    console.log("Editor instance mounted:", !!editorRef.current)
    if (onMountEditor) {
      onMountEditor(editor)
    }

    editor.updateOptions({
      ...defaultEditorOptions,
      // Enable inline suggestions but with specific settings to prevent conflicts
      inlineSuggest: {
        enabled: true,
        mode: "prefix",
        suppressSuggestions: false,
      },
      // Disable some conflicting suggest features
      suggest: {
        preview: false, // Disable preview to avoid conflicts
        showInlineDetails: false,
        insertMode: "replace",
      },
      // Quick suggestions
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false,
      },
      // Smooth cursor
      cursorSmoothCaretAnimation: "on",
    })

    configureMonaco(monaco)

    // Non-conflicting keyboard shortcuts for on-demand AI code suggestion:
    // 1. Ctrl + Space (Standard IDE suggest, no Mac symbol)
    editor.addCommand(monaco.KeyMod.WinCtrl | monaco.KeyCode.Space, () => {
      onTriggerSuggestion("completion", editor)
    })
    // 2. Cmd + \ (Mac) / Ctrl + \ (Win)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backslash, () => {
      onTriggerSuggestion("completion", editor)
    })
    // 3. Cmd + I (Mac) / Ctrl + I (Win)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI, () => {
      onTriggerSuggestion("completion", editor)
    })

    // CRITICAL: Override Tab key with high priority and prevent default Monaco behavior
    if (tabCommandRef.current) {
      tabCommandRef.current.dispose()
    }

    tabCommandRef.current = editor.addCommand(
      monaco.KeyCode.Tab,
      () => {
        console.log("TAB PRESSED", {
          hasSuggestion: !!currentSuggestionRef.current,
          hasActiveSuggestion: hasActiveSuggestionAtPosition(),
          isAccepting: isAcceptingSuggestionRef.current,
          suggestionAccepted: suggestionAcceptedRef.current,
        })

        // CRITICAL: Block if already processing
        if (isAcceptingSuggestionRef.current) {
          console.log("BLOCKED: Already in the process of accepting, ignoring Tab")
          return
        }

        // CRITICAL: Block if just accepted
        if (suggestionAcceptedRef.current) {
          console.log("BLOCKED: Suggestion was just accepted, using default tab")
          editor.trigger("keyboard", "tab", null)
          return
        }

        // If we have an active suggestion at the current position, try to accept it
        if (currentSuggestionRef.current && hasActiveSuggestionAtPosition()) {
          console.log("ATTEMPTING to accept suggestion with Tab")
          const accepted = acceptCurrentSuggestion()
          if (accepted) {
            console.log("SUCCESS: Suggestion accepted via Tab, preventing default behavior")
            return // CRITICAL: Return here to prevent default tab behavior
          }
          console.log("FAILED: Suggestion acceptance failed, falling through to default")
        }

        // Default tab behavior (indentation)
        console.log("DEFAULT: Using default tab behavior")
        editor.trigger("keyboard", "tab", null)
      },
      // CRITICAL: Use specific context to override Monaco's built-in Tab handling
      "editorTextFocus && !editorReadonly && !suggestWidgetVisible",
    )

    // Escape to reject
    editor.addCommand(monaco.KeyCode.Escape, () => {
      console.log("Escape pressed")
      if (currentSuggestionRef.current) {
        onRejectSuggestion(editor)
        clearCurrentSuggestion()
      }
    })

    // Listen for cursor position changes to hide suggestions when moving away
    editor.onDidChangeCursorPosition((e: any) => {
      if (isAcceptingSuggestionRef.current) return

      const newPosition = e.position

      // Clear existing suggestion if cursor moved away
      if (currentSuggestionRef.current && !suggestionAcceptedRef.current) {
        const suggestionPos = currentSuggestionRef.current.position

        // If cursor moved away from suggestion position, clear it
        if (
          newPosition.lineNumber !== suggestionPos.line ||
          newPosition.column < suggestionPos.column ||
          newPosition.column > suggestionPos.column + 10
        ) {
          console.log("Cursor moved away from suggestion, clearing")
          clearCurrentSuggestion()
          onRejectSuggestion(editor)
        }
      }
    })

    // Listen for content changes to detect manual typing over suggestions
    editor.onDidChangeModelContent((e: any) => {
      if (isAcceptingSuggestionRef.current) return

      // If user types while there's a suggestion, clear it (unless it's our insertion)
      if (currentSuggestionRef.current && e.changes.length > 0 && !suggestionAcceptedRef.current) {
        const change = e.changes[0]

        // Check if this is our own suggestion insertion
        if (
          change.text === currentSuggestionRef.current.text ||
          change.text === currentSuggestionRef.current.text.replace(/\r/g, "")
        ) {
          console.log("Our suggestion was inserted, not clearing")
          return
        }

        // User typed something else, clear the suggestion
        console.log("User typed while suggestion active, clearing")
        clearCurrentSuggestion()
      }
    })

    updateEditorLanguage()
  }

  const updateEditorLanguage = () => {
    if (!activeFile || !monacoRef.current || !editorRef.current) return
    const model = editorRef.current.getModel()
    if (!model) return

    const language = getEditorLanguage(activeFile.fileExtension || "")
    try {
      monacoRef.current.editor.setModelLanguage(model, language)
    } catch (error) {
      console.warn("Failed to set editor language:", error)
    }
  }

  useEffect(() => {
    updateEditorLanguage()
  }, [activeFile])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current)
      }
      if (inlineCompletionProviderRef.current) {
        inlineCompletionProviderRef.current.dispose()
        inlineCompletionProviderRef.current = null
      }
      if (tabCommandRef.current) {
        tabCommandRef.current.dispose()
        tabCommandRef.current = null
      }
    }
  }, [])

  return (
    <div className="h-full relative">
      {/* Loading indicator */}
      {suggestionLoading && (
        <div className="absolute top-2 right-4 z-20 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs text-indigo-400 flex items-center gap-2 backdrop-blur-md shadow-lg">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
          Generating AI suggestion...
        </div>
      )}

      {/* Interactive Suggestion Banner */}
      {suggestion && !suggestionLoading && (
        <div className="absolute top-2 right-4 z-20 bg-zinc-900/95 border border-indigo-500/40 px-3 py-2 rounded-lg text-xs flex items-center gap-3 backdrop-blur-md shadow-xl text-zinc-200">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-400">AI Suggestion:</span>
            <code className="max-w-[180px] truncate bg-zinc-800 px-1.5 py-0.5 rounded text-[11px] text-zinc-300 font-mono">
              {suggestion.split("\n")[0]}
            </code>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => acceptCurrentSuggestion()}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition cursor-pointer text-xs flex items-center gap-1"
            >
              <span>Tab to Accept</span>
            </button>
            <button
              onClick={() => {
                clearCurrentSuggestion();
                onRejectSuggestion(editorRef.current);
              }}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded transition cursor-pointer text-xs"
            >
              Esc
            </button>
          </div>
        </div>
      )}

      <Editor
        height="100%"
        value={content}
        onChange={(value) => onContentChange(value || "")}
        onMount={handleEditorDidMount}
        language={activeFile ? getEditorLanguage(activeFile.fileExtension || "") : "plaintext"}
        options={defaultEditorOptions as any}
      />
    </div>
  )
}
