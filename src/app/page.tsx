'use client';

import { useState } from 'react';
import styles from './page.module.css';
import fetchMonsterImage from './lib/api';
import Image from 'next/image';
import Loading from 'react-loading';
import MonsterForm from './components/MonsterForm';

export default function Home() {
  const [monsterImage, setMonsterImage] = useState<string>('');
  const [formData, setFormData] = useState({
    description: '',
    attribute: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFormSubmit = async (description: string, attribute: string) => {
    setFormData({ description, attribute });
    setIsLoading(true);
    const imageUrl: string = await fetchMonsterImage({
      description,
      attribute,
    });
    setMonsterImage(imageUrl);
    setIsLoading(false);
  };

  const handleXShare = () => {
    const shareUrl = encodeURIComponent(monsterImage);
    const twitterText = encodeURIComponent(
      `ついに発見！${formData.description}、${formData.attribute}タイプの新しいモンスター！？😂 \n #モンスター画像生成 \n`
    );
    const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${shareUrl}`;
    window.open(twitterUrl, '_blank');
  };

  const LoadingSection = () => (
    <>
      <Loading
        type="spinningBubbles"
        color="#0070f3"
        height={300}
        width={300}
      />
      <p className={styles.loadingText}>画像を生成中です…</p>
    </>
  );

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>AI Monster Generator</h1>
        <MonsterForm
          onSubmit={handleFormSubmit}
          isRegenerated={!!monsterImage}
        />
        <div className={styles.imageContainer}>
          {isLoading ? (
            <LoadingSection />
          ) : (
            monsterImage && (
              <>
                <Image
                  src={monsterImage}
                  alt="Generated Monster"
                  className={styles.monsterImage}
                  width={300}
                  height={300}
                />
                <button className={styles.shareButton} onClick={handleXShare}>
                  X（旧Twitter）で自慢する
                </button>
              </>
            )
          )}
        </div>
      </main>
    </div>
  );
}
