import { Component, OnInit } from '@angular/core';
import { AiService, ChatResponse } from '../core/services/ai.service';

@Component({
  selector: 'app-ai',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.scss']
})
export class AiComponent implements OnInit {
  message = '';
  chatHistory: { role: string; content: string }[] = [];
  loading = false;
  error?: string;

  constructor(private aiService: AiService) {}

  ngOnInit(): void {}

  send(): void {
    if (!this.message.trim()) return;
    this.loading = true;
    this.chatHistory.push({ role: 'user', content: this.message });
    this.aiService.chat(this.message).subscribe({
      next: (resp: ChatResponse) => {
        this.chatHistory.push({ role: 'ai', content: resp.reply });
        this.message = '';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Chat failed';
        this.loading = false;
      }
    });
  }
}
