'use client';

import { TextInput } from "@/components/ui/TextInput";
import styles from "./ContactPage.module.css";
import { Header } from "@/components/layout/Header";
import { useState } from "react";
import { SimpleButton } from "../ui/SimpleButton";

type InputKey = "name" | "email" | "inquiry";

export function ContactPage() {
  const [preview, setPreview] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiry: "",
  });
  const [completeText, setCompleteText] = useState<string|null>(null);
  const [errorText, setErrorText] = useState<Partial<Record<InputKey, string>>|null>(null);

  const handleInputChange = (field: InputKey, value: string) => {
    setErrorText(null);

    setFormData({
      ...formData,
      [field]: value,
    });
  }

  const checkValidation = () => {
    if (Object.values(formData).some(v => !v.trim())) {
      setErrorText(
        Object.entries(formData)
          .filter(([_, v]) => !v.trim())
          .reduce((acc, [k, _]) => {
            acc[k as InputKey] = "この項目は必須です。";
            return acc;
          }, {} as Partial<Record<InputKey, string>>)
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorText({ email: "有効なメールアドレスを入力してください。" });
      return;
    }

    setPreview(true);
  };

  const [sending, setSending] = useState(false);

  const sendInquiry = async () => {
    setSending(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "送信に失敗しました。");
      }

      setCompleteText("送信が完了しました。ありがとうございました。");
    } catch (error) {
      setCompleteText(
        error instanceof Error ? error.message : "送信に失敗しました。時間をおいて再度お試しください。"
      );
    } finally {
      setSending(false);
    }
  };

  return <>
    <Header>
      <h1 className={styles.title}>お問い合わせ</h1>
    </Header>
    <div className={styles.content}>
      {
        completeText ? (
          <div className={styles.description}>{completeText}</div>
        ) : (
          <>
            <p className={styles.description}>お仕事のご依頼やご相談など、お気軽にお問い合わせください。</p>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <TextInput
                  label="お名前"
                  type="text"
                  placeholder="秋山 雄哉"
                  value={formData.name}
                  onChange={handleInputChange.bind(null, "name")}
                  preview={preview}
                  alert={errorText?.name}
                />
              </div>
              <div className={styles.contactItem}>
                <TextInput
                  label="メールアドレス"
                  type="email"
                  placeholder="akiyama@example.com"
                  value={formData.email}
                  onChange={handleInputChange.bind(null, "email")}
                  preview={preview}
                  alert={errorText?.email}
                />
              </div>
              <div className={styles.contactItem}>
                <TextInput
                  label="お問い合わせ内容"
                  type="textarea"
                  value={formData.inquiry}
                  onChange={handleInputChange.bind(null, "inquiry")}
                  preview={preview}
                  alert={errorText?.inquiry}
                />
              </div>
              {!preview && (
                <div className={styles.privacy}>
                  <h2 className={styles.privacyTitle}>プライバシーポリシー</h2>
                  <p className={styles.privacyConsent}>送信することで、以下のプライバシーポリシーに同意したものとみなします。</p>
                  <div className={styles.privacyBox}>
                    <p>当サイトでは、お問い合わせの際に以下の個人情報を取得いたします。</p>
                    <h3>1. 取得する情報</h3>
                    <p>お名前、メールアドレス、お問い合わせ内容、送信元IPアドレス</p>
                    <h3>2. 利用目的</h3>
                    <p>お問い合わせへの回答およびご連絡のために利用いたします。それ以外の目的では使用いたしません。</p>
                    <h3>3. 第三者提供</h3>
                    <p>取得した個人情報は、法令に基づく場合を除き、第三者に提供することはありません。</p>
                    <h3>4. 情報の管理</h3>
                    <p>取得した個人情報は適切に管理し、不要となった場合は速やかに削除いたします。</p>
                    <h3>5. お問い合わせ</h3>
                    <p>個人情報の取り扱いに関するお問い合わせは、本フォームよりご連絡ください。</p>
                  </div>
                </div>
              )}
              <div className={styles.submitArea}>
                {
                  preview
                    ? <>
                      <SimpleButton
                        type="light"
                        onClick={() => setPreview(false)}
                      >
                        戻る
                      </SimpleButton>
                      <SimpleButton
                        type="primary"
                        onClick={sendInquiry}
                        disabled={sending}
                      >
                        {sending ? "送信中..." : "送信する"}
                      </SimpleButton>
                    </>
                    : <SimpleButton
                        onClick={checkValidation}
                      >
                        確認画面へ
                      </SimpleButton>
                }
              </div>
            </div>
          </>
        )
      }
    </div>
  </>
}