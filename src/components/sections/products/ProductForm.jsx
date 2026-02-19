import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";
import ImageUploader from "./ImageUploader";
import PriceInput from "./PriceInput";
import FormActions from "./FormActions";

export default function ProductForm() {
  return (
    <div className="w-full bg-white rounded-2xl p-6 space-y-6">

      {/* ROW 1 */}
      <div className="grid grid-cols-4 gap-4 text-right">
        <FormInput label=":کد محصول" placeholder="338875" />
        <FormInput label=":ارسال محصول" placeholder="رایگان ارسال" />
        <FormInput label=":ڕێکەوت انقضا محصول" placeholder="1404/11/30" />
        <FormInput label=":عنوان محصول" placeholder="Kenta moroccan cream" />
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-5 gap-4 items-end">
        <ImageUploader />
        <PriceInput label="قیمت فروش (تخفیف خورده):" value="1,400,000 IQD" />
        <PriceInput label="قیمت عمده:" value="1,400,000 IQD" />
        <PriceInput label="قیمت فروش:" value="1,600,000 IQD" />
        <PriceInput label="قیمت خرید:" value="950,000 IQD" />
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-3 gap-4">
        <FormInput
          label="ڕێکەوت انقضا تخفیف:"
          placeholder="2026/03/25 — ساعت 00:00"
        />
        <FormInput label="برند:" placeholder="Dior" />
        <FormInput label="دسته بندی:" placeholder="بهداشتی، کرم آبرسان" />
      </div>

      {/* TEXTAREAS */}
      <FormTextarea label="توضیحات بە انگلیسی:" />
      <FormTextarea label="توضیحات بە عربی:" />
      <FormTextarea label="توضیحات بە کردی:" />

      {/* ACTIONS */}
      <FormActions />
    </div>
  );
}
