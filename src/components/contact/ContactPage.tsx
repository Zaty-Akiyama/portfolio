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

  const [errorText, setErrorText] = useState<Partial<Record<InputKey, string>>|null>(null);

  // const isErrorTarget = (key: InputKey) => {
  //   if (!errorTarget?.includes(key)) return undefined;
  //   return errorText;
  // }

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

  return <>
    <Header>
      <h1 className={styles.title}>お問い合わせ</h1>
    </Header>
    <div className={styles.content}>
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
                  onClick={() => alert('送信しました！')}
                >
                  送信する
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
    </div>
  </>
}