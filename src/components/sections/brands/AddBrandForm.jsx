import TextInput from ".././categories/TextInput";
import SelectInput from "../categories/SelectInput";
import ImageUploader from "../categories/ImageUploader";

export default function AddBrandForm() {
  return (
    <div className="flex flex-col gap-6">

      <h2 className="text-right text-[#273959] font-bold text-[20px]">
        اضافه کردن دسته بندی
      </h2>

      <TextInput
        label=":نام اصلی (انگلیسی)"
        value="Various Products"
      />

      <SelectInput
        label=":دسته بندی مادر"
        value="بهداشتی"
      />

      <ImageUploader label=":تصویر دسته بندی" />

    </div>
  );
}
