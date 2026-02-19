// dashboard/src/components/sections/products/AddProductForm.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectInput from "./SelectInput";
import ImageUploader from "./ImageUploader";
import PriceInput from "./PriceInput";
import DateTimePicker from "./DateTimePicker";

import {
  createProduct,
  updateProduct,
  fetchProductById,
} from "../../../services/products.service.js";

import { fetchCategories } from "../../../services/categories.service.js";
import { fetchBrands } from "../../../services/brands.service.js";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/api/v1";

const API_ORIGIN = API_BASE.replace(/\/api\/v1$/, "");

function resolveAssetUrl(u) {
  if (!u) return null;
  if (typeof u !== "string") return null;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/uploads/")) return `${API_ORIGIN}${u}`;
  return u;
}

function toISOorEmpty(d) {
  if (!d) return "";
  try {
    const dt = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toISOString();
  } catch {
    return "";
  }
}

function pickFirst(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return "";
}

function safeDateOrNull(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

// ✅ unwrap helper: پوشش data.data و انواع ساختارها
function unwrapApi(res) {
  if (!res) return null;
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
}

// ✅ خروجی‌های رایج بک: { data:[...] } یان { items:[...] } یان خود آرایه
function unwrapList(res) {
  const p = unwrapApi(res);
  if (Array.isArray(p)) return p;
  if (Array.isArray(p?.data)) return p.data;
  if (Array.isArray(p?.items)) return p.items;
  return [];
}

function mapBackendToForm(raw) {
  const p = raw || {};

  const name_en = pickFirst(p.name_en, p.nameEn, p.name, "");
  const categoryName = pickFirst(p.categoryName, p.category, "");
  const subCategoryName = pickFirst(p.subCategoryName, p.subCategory, "");
  const brandName = pickFirst(p.brandName, p.brand, "");
  const barcode = pickFirst(p.barcode, p.code, "");

  const expireDate = pickFirst(p.expireDate, p.expire_at, null);

  const price = pickFirst(p.price, "");
  const costPrice = pickFirst(p.costPrice, "");
  const wholesalePrice = pickFirst(p.wholesalePrice, "");
  const discountPercent = pickFirst(p.discountPercent, "");

  const stock = pickFirst(p.stock, 0);

  const descriptionEN = pickFirst(
    p.description_en,
    p.descriptionEN,
    p.description?.en,
    ""
  );
  const descriptionAR = pickFirst(
    p.description_ar,
    p.descriptionAR,
    p.description?.ar,
    ""
  );
  const descriptionKR = pickFirst(
    p.description_kur,
    p.descriptionKR,
    p.description?.kur,
    p.description?.ku,
    ""
  );

  const freeShipping = Boolean(p.freeShipping ?? false);

  const mainImage = resolveAssetUrl(pickFirst(p.mainImage, null));

  // ✅ خیلی مهم بۆ تاگل فعال/غیرفعال:
  // ئەگەر بک لە isActive / isHidden استفاده دە‌کنه، اینجا نگه دە‌داریم کە لەگەڵ آپدیت فرم لە دست نره
  const isActive = Boolean(p.isActive ?? true);
  const isHidden = Boolean(p.isHidden ?? false);

  return {
    form: {
      title: name_en || "",
      code: barcode || "",

      categoryName: categoryName || "",
      subCategoryName: subCategoryName || "",

      brand: brandName || "",
      stock: String(stock ?? 0),

      prices: {
        purchase: costPrice !== "" && costPrice != null ? String(costPrice) : "",
        sale: price !== "" && price != null ? String(price) : "",
        wholesale:
          wholesalePrice !== "" && wholesalePrice != null
            ? String(wholesalePrice)
            : "",
        discounted:
          discountPercent !== "" && discountPercent != null
            ? String(discountPercent)
            : "",
      },

      freeShipping,
      shippingIncluded: false,
      mainImage,
      descriptionEN,
      descriptionAR,
      descriptionKR,

      // ✅ hidden fields (بدون UI)
      isActive,
      isHidden,
    },
    productExpire: safeDateOrNull(expireDate),
    discountExpire: null, // UI only
  };
}

function buildFormData({ form, productExpire, isEdit }) {
  const fd = new FormData();

  fd.append("name_en", String(form.title || "").trim());
  fd.append("categoryName", String(form.categoryName || "").trim());
  fd.append("subCategoryName", String(form.subCategoryName || "").trim());
  fd.append("brandName", String(form.brand || "").trim());
  fd.append("barcode", String(form.code || "").trim());

  const sale = Number(form.prices.sale);
  const cost = Number(form.prices.purchase);
  const wholesale = Number(form.prices.wholesale);

  fd.append("price", Number.isFinite(sale) ? String(sale) : "");
  fd.append("costPrice", Number.isFinite(cost) ? String(cost) : "");
  fd.append(
    "wholesalePrice",
    Number.isFinite(wholesale) ? String(wholesale) : ""
  );

  const stockNum = Number(form.stock);
  fd.append(
    "stock",
    Number.isFinite(stockNum) && stockNum >= 0 ? String(stockNum) : "0"
  );

  fd.append("freeShipping", String(!!form.freeShipping));

  if (form.mainImage instanceof File) {
    fd.append("mainImage", form.mainImage);
  } else {
    if (!isEdit) fd.append("mainImage", "");
  }

  const expireISO = toISOorEmpty(productExpire);
  if (expireISO) fd.append("expireDate", expireISO);

  if (form.prices.discounted !== "") {
    const dp = Number(form.prices.discounted);
    if (Number.isFinite(dp)) fd.append("discountPercent", String(dp));
  }

  fd.append("description_en", String(form.descriptionEN || ""));
  fd.append("description_ar", String(form.descriptionAR || ""));
  fd.append("description_kur", String(form.descriptionKR || ""));

  // ✅ کلیدی‌ترین بخش بۆ اینکه وقتی محصول غیرفعال شد،
  // لە سایت اصلی هم نیاد و لەگەڵ ذخیره/ویرایش دوباره فعال نشه:
  // (بدون تغییر UI فقط state رو پاس دە‌دیم)
  fd.append("isActive", String(!!form.isActive));
  fd.append("isHidden", String(!!form.isHidden));

  return fd;
}

export default function AddProductForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const isEdit = useMemo(
    () =>
      state?.mode === "edit" ||
      !!state?.productId ||
      !!state?.product?.id ||
      !!state?.product?._id,
    [state]
  );

  const editingId = useMemo(
    () => state?.productId || state?.product?.id || state?.product?._id,
    [state]
  );

  const [productExpire, setProductExpire] = useState(null);
  const [discountExpire, setDiscountExpire] = useState(null);

  const [form, setForm] = useState({
    title: "",
    code: "",
    categoryName: "",
    subCategoryName: "",
    brand: "",
    stock: "0",
    prices: { purchase: "", sale: "", wholesale: "", discounted: "" },
    freeShipping: false,
    shippingIncluded: false,
    mainImage: null,
    descriptionEN: "",
    descriptionAR: "",
    descriptionKR: "",

    // ✅ hidden fields (بدون UI)
    isActive: true,
    isHidden: false,
  });

  const [loading, setLoading] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState(null);

  const [brandOptions, setBrandOptions] = useState([]);
  const [catsRaw, setCatsRaw] = useState([]);

  // ✅ جلوگیری لە ریست شدن subCategoryName هنگام hydrate ادیت
  const skipSubResetRef = useRef(false);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handlePriceChange = (field, value) =>
    setForm((prev) => ({
      ...prev,
      prices: { ...prev.prices, [field]: value },
    }));

  useEffect(() => {
    let alive = true;

    const loadOptions = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          fetchCategories({ page: 1, limit: 500 }),
          fetchBrands({ page: 1, limit: 500 }),
        ]);

        const cats = unwrapList(catsRes);
        const brands = unwrapList(brandsRes);

        if (!alive) return;

        setCatsRaw(cats);

        setBrandOptions(
          brands
            .map((b) => String(b?.name || "").trim())
            .filter(Boolean)
        );
      } catch (e) {
        console.error("load categories/brands failed:", e);
        if (!alive) return;
        setCatsRaw([]);
        setBrandOptions([]);
      }
    };

    loadOptions();
    return () => {
      alive = false;
    };
  }, []);

  const parentCategoryOptions = useMemo(() => {
    const parents = catsRaw.filter((c) => !c?.parentId);
    return parents.map((c) => c?.name_en).filter(Boolean);
  }, [catsRaw]);

  const subCategoryOptions = useMemo(() => {
    if (!form.categoryName) return [];
    const parent = catsRaw.find((c) => c?.name_en === form.categoryName);
    if (!parent?._id) return [];

    const subs = catsRaw.filter(
      (c) => String(c?.parentId) === String(parent._id)
    );

    return subs.map((c) => c?.name_en).filter(Boolean);
  }, [catsRaw, form.categoryName]);

  // ✅ فقط وقتی کاربر دستی categoryName رو تغییر داد، sub رو ریست کن
  useEffect(() => {
    if (skipSubResetRef.current) {
      skipSubResetRef.current = false;
      return;
    }
    setForm((p) => ({ ...p, subCategoryName: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.categoryName]);

  useEffect(() => {
    let alive = true;

    const hasAr = (obj) =>
      pickFirst(
        obj?.description_ar,
        obj?.descriptionAR,
        obj?.description?.ar,
        ""
      ) !== "";
    const hasKr = (obj) =>
      pickFirst(
        obj?.description_kur,
        obj?.descriptionKR,
        obj?.description?.kur,
        obj?.description?.ku,
        ""
      ) !== "";

    const hydrate = async () => {
      if (!isEdit) {
        setInitialSnapshot(null);
        return;
      }

      try {
        setLoading(true);

        const rawFromState = state?.product?.__raw || state?.product || null;
        const stateIsIncomplete =
          rawFromState &&
          (!hasAr(rawFromState) ||
            !hasKr(rawFromState) ||
            !rawFromState?.subCategoryName);

        if (rawFromState && !stateIsIncomplete) {
          const mapped = mapBackendToForm(rawFromState);
          if (!alive) return;

          skipSubResetRef.current = true;

          setForm(mapped.form);
          setProductExpire(mapped.productExpire);
          setDiscountExpire(mapped.discountExpire);
          setInitialSnapshot(mapped);
          return;
        }

        if (editingId) {
          const res = await fetchProductById(editingId);
          const raw = unwrapApi(res);
          const mapped = mapBackendToForm(raw);

          if (!alive) return;

          skipSubResetRef.current = true;

          setForm(mapped.form);
          setProductExpire(mapped.productExpire);
          setDiscountExpire(mapped.discountExpire);
          setInitialSnapshot(mapped);
        }
      } catch (e) {
        console.error("prefill edit failed:", e);
        alert(e?.message || "خطا لە دریافت اطلاعات محصول بۆ ویرایش");
      } finally {
        if (alive) setLoading(false);
      }
    };

    hydrate();
    return () => {
      alive = false;
    };
  }, [isEdit, editingId, state]);

  const validate = () => {
    const errors = [];

    if (!form.title || form.title.trim().length < 2)
      errors.push("عنوان محصول الزامی ە.");
    if (!form.code || form.code.trim().length < 1)
      errors.push("کد محصول الزامی ە.");

    if (!form.brand || form.brand.trim().length < 1)
      errors.push("برند الزامی ە.");

    if (!form.categoryName || form.categoryName.trim().length < 1)
      errors.push("دسته‌بندی اصلی الزامی ە.");

    if (!form.subCategoryName || form.subCategoryName.trim().length < 1)
      errors.push("زیر دسته‌بندی الزامی ە.");

    const cost = Number(form.prices.purchase);
    const sale = Number(form.prices.sale);
    const wholesale = Number(form.prices.wholesale);

    if (!Number.isFinite(sale) || sale <= 0)
      errors.push("قیمت فروش الزامی و باید معتبر باشد.");
    if (!Number.isFinite(cost) || cost < 0)
      errors.push("قیمت خرید الزامی و باید معتبر باشد.");
    if (!Number.isFinite(wholesale) || wholesale < 0)
      errors.push("قیمت عمده الزامی و باید معتبر باشد.");

    const stock = Number(form.stock);
    if (!Number.isFinite(stock) || stock < 0)
      errors.push("تعداد محصول الزامی و باید معتبر باشد.");

    if (!productExpire) errors.push("ڕێکەوت انقضا محصول الزامی ە.");

    if (!isEdit && !(form.mainImage instanceof File))
      errors.push("بۆ افزودن محصول، انتخاب عکس الزامی ە.");

    if (!form.descriptionEN?.trim()) errors.push("توضیحات انگلیسی الزامی ە.");
    if (!form.descriptionAR?.trim()) errors.push("توضیحات عربی الزامی ە.");
    if (!form.descriptionKR?.trim()) errors.push("توضیحات کوردی الزامی ە.");

    if (form.prices.discounted !== "") {
      const dp = Number(form.prices.discounted);
      if (!Number.isFinite(dp) || dp < 0 || dp > 100) {
        errors.push("قیمت فروش (تخفیف خورده) باید بین 0 تا 100 باشد.");
      }
      if (!discountExpire) {
        errors.push(
          "لە صورت وارد کردن قیمت تخفیف خورده، ڕێکەوت انقضا تخفیف الزامی ە."
        );
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (errs.length) {
      alert(errs.join("\n"));
      return;
    }

    setLoading(true);

    try {
      const payload = buildFormData({ form, productExpire, isEdit });

      if (isEdit && editingId) {
        await updateProduct(editingId, payload);
        alert("محصول لەگەڵ سەرکەوتوو ویرایش شد!");
      } else {
        await createProduct(payload);
        alert("محصول لەگەڵ سەرکەوتوو ذخیره شد!");
      }

      navigate("/products", { replace: true, state: { refresh: Date.now() } });
    } catch (err) {
      console.error("save product failed:", err);
      alert(err?.message || "خطا لە ذخیره محصول");
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    if (isEdit && initialSnapshot) {
      skipSubResetRef.current = true;
      setForm(initialSnapshot.form);
      setProductExpire(initialSnapshot.productExpire);
      setDiscountExpire(initialSnapshot.discountExpire);
      return;
    }

    setForm({
      title: "",
      code: "",
      categoryName: "",
      subCategoryName: "",
      brand: "",
      stock: "0",
      prices: { purchase: "", sale: "", wholesale: "", discounted: "" },
      freeShipping: false,
      shippingIncluded: false,
      mainImage: null,
      descriptionEN: "",
      descriptionAR: "",
      descriptionKR: "",

      // ✅ hidden fields (بدون UI)
      isActive: true,
      isHidden: false,
    });

    setProductExpire(null);
    setDiscountExpire(null);
  };

  return (
    <form
      className="w-full bg-transparent rounded-2xl p-4 sm:p-6"
      onSubmit={handleSubmit}
    >
      {/* ROW 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <TextInput
          label=":عنوان محصول"
          value={form.title}
          onChange={(v) => handleChange("title", v)}
        />

        <div className="flex flex-col gap-4 sm:gap-6 py-4">
          <label className="text-xs sm:text-sm font-medium lg:text-right text-right md:text-center">
            :ارسال محصول
          </label>
          <div className="flex flex-col sm:flex-row md:items-start items-end sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.shippingIncluded}
                onChange={(e) =>
                  handleChange("shippingIncluded", e.target.checked)
                }
              />
              شامل هزینه ارسال
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.freeShipping}
                onChange={(e) => handleChange("freeShipping", e.target.checked)}
              />
              رایگان ە
            </label>
          </div>
        </div>

        <DateTimePicker
          label=":ڕێکەوت انقضا محصول"
          value={productExpire}
          onChange={setProductExpire}
        />

        <TextInput
          label=":کد محصول"
          value={form.code}
          onChange={(v) => handleChange("code", v)}
        />
      </div>

      {/* ROW 2 */}
      <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="w-full lg:w-[28%]">
          <ImageUploader
            value={form.mainImage}
            onChange={(v) => handleChange("mainImage", v)}
          />
        </div>

        <div className="w-full lg:w-[72%] flex flex-col gap-4 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            <PriceInput
              label=":قیمت فروش"
              value={form.prices.sale}
              onChange={(v) => handlePriceChange("sale", v)}
            />
            <PriceInput
              label=":قیمت خرید"
              value={form.prices.purchase}
              onChange={(v) => handlePriceChange("purchase", v)}
            />
            <PriceInput
              label=":قیمت عمده"
              value={form.prices.wholesale}
              onChange={(v) => handlePriceChange("wholesale", v)}
            />
            <PriceInput
              label=":قیمت فروش ( تخفیف خورده )"
              value={form.prices.discounted}
              onChange={(v) => handlePriceChange("discounted", v)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <DateTimePicker
                label=":ڕێکەوت انقضا تخفیف"
                value={discountExpire}
                onChange={setDiscountExpire}
              />

              <TextInput
                label=":تعداد محصول"
                value={form.stock}
                onChange={(v) =>
                  handleChange("stock", String(v).replace(/\D/g, ""))
                }
                type="text"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <SelectInput
                label=":برند"
                value={form.brand}
                options={brandOptions}
                onChange={(v) => handleChange("brand", v)}
              />

              <SelectInput
                label=":دسته بندی اصلی"
                value={form.categoryName}
                options={parentCategoryOptions}
                onChange={(v) => handleChange("categoryName", v)}
              />

              <SelectInput
                label=":زیر دسته بندی"
                value={form.subCategoryName}
                options={subCategoryOptions}
                onChange={(v) => handleChange("subCategoryName", v)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TEXTS */}
      <div className="space-y-4 sm:space-y-6">
        <TextArea
          label=":توضیحات بە انگلیسی"
          value={form.descriptionEN}
          onChange={(v) => handleChange("descriptionEN", v)}
        />
        <TextArea
          label=":توضیحات بە عربی"
          value={form.descriptionAR}
          onChange={(v) => handleChange("descriptionAR", v)}
        />
        <TextArea
          label=":توضیحات بە کوردی"
          value={form.descriptionKR}
          onChange={(v) => handleChange("descriptionKR", v)}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-8">
        <button
          type="button"
          onClick={onReset}
          className="px-6 sm:px-8 py-2 rounded-lg font-bold bg-gray-400 text-white text-xs sm:text-[10px]"
        >
          حذف
        </button>

        <button
          disabled={loading}
          type="submit"
          className="px-6 sm:px-8 py-2 rounded-lg font-bold bg-[#2B4168] text-white text-xs sm:text-[10px]"
        >
          {loading ? "لە حال ذخیره..." : "ذخیره"}
        </button>
      </div>
    </form>
  );
}
