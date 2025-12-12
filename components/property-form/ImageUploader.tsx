"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function ImageUploader({ images, setImages, propertyId }: any) {

  async function handleUpload(e: any) {
    const files = e.target.files;
    if (!files) return;

    for (let file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${propertyId}/${fileName}`;

      const { error: uploadError } = await supabaseBrowser.storage
        .from("property-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error(uploadError);
        continue;
      }

      const { data: urlData } = supabaseBrowser.storage
        .from("property-images")
        .getPublicUrl(filePath);

      setImages((prev: any) => [...prev, urlData.publicUrl]);
    }
  }

  function removeImage(url: string) {
    setImages(images.filter((img: string) => img !== url));
  }

  return (
    <div className="space-y-4">

      <input
        type="file"
        multiple
        onChange={handleUpload}
        className="border p-2 rounded"
      />

      <div className="grid grid-cols-3 gap-4 mt-4">
        {images.map((url: string, idx: number) => (
          <div key={idx} className="relative group">
            <img
              src={url}
              className="w-full h-32 object-cover rounded"
            />

            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-2 right-2 bg-black/60 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
