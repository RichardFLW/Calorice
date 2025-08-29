import MacroGroup from "./MacroGroup";
import MacroField from "./MacroField";

type Props = {
  control: any; // react-hook-form
  errors: Record<string, any>;
};

export default function MacrosBlock({ control, errors }: Props) {
  return (
    <div className="space-y-6">
      <MacroGroup title="Énergie">
        <MacroField
          control={control}
          errors={errors}
          name="caloriesPerPortion"
          label="Calories (par portion)"
          unit="kcal"
        />
        <MacroField
          control={control}
          errors={errors}
          name="servingSize"
          label="Taille portion"
          unit="g/ml"
        />
      </MacroGroup>

      <MacroGroup title="Lipides">
        <MacroField
          control={control}
          errors={errors}
          name="fatPerPortion"
          label="Lipides"
          unit="g"
        />
        <MacroField
          control={control}
          errors={errors}
          name="saturatedPerPortion"
          label="Acides gras saturés"
          unit="g"
        />
      </MacroGroup>

      <MacroGroup title="Glucides">
        <MacroField
          control={control}
          errors={errors}
          name="carbsPerPortion"
          label="Glucides"
          unit="g"
        />
        <MacroField
          control={control}
          errors={errors}
          name="sugarPerPortion"
          label="Sucres"
          unit="g"
        />
        <MacroField
          control={control}
          errors={errors}
          name="fiberPerPortion"
          label="Fibres"
          unit="g"
        />
      </MacroGroup>

      <MacroGroup title="Protéines">
        <MacroField
          control={control}
          errors={errors}
          name="proteinPerPortion"
          label="Protéines"
          unit="g"
        />
      </MacroGroup>
    </div>
  );
}
