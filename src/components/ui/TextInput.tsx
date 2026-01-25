import { cn } from "@/utils/cn";
import styles from "./TextInput.module.css";

interface TextInputProps {
  label: string;
  value: string;
  type: 'text' | 'email' | 'password' | 'textarea';
  onChange: (v: string) => void;
  placeholder?: string;
  note?: string;
  alert?: string;
  labelWidth?: string;
  preview?: boolean;
}

/**
 * inputやtextareaの共通コンポーネント
 * 
 */
export function TextInput({ label, value, type, onChange, placeholder, note, alert, labelWidth, preview }: TextInputProps) {
  return (
    <>
      <label
        className={styles.label}
        aria-label="text input"
        style={{ '--label-width': labelWidth || '160px' } as React.CSSProperties}
      >
        <span className={cn(styles.labelText, preview && styles.isPreview)}>{label}</span>
        {
          preview ?
            (
              <div className={cn(styles.preview)}>{value}</div>
            )
            : <>
              {
                type === 'textarea' ? (
                  <textarea
                    className={cn(styles.input, styles.textarea, alert && styles.hasAlert)}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                ) : (
                  <input
                    className={cn(styles.input, alert && styles.hasAlert)}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                )
              }
              {
                placeholder ? <span className={styles.placeholder}>{placeholder}</span> : null
              }
              {
                alert ? <p className={styles.alert}>{alert}</p> : null
              }
            </>
        }
      </label>
      {
        !preview &&
          <>
            {
              note ? <p className={styles.note}>{note}</p> : null
            }
          </>
      }
    </>
  );
}