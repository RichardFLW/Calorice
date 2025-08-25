// __tests__/components/EmailCapture.test.tsx
import { vi } from "vitest";

// ✅ Mock AVANT toute import du composant
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

// ✅ Assure la présence du symbole React pour la transpilation JSX sous test
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmailCapture from "@/components/forms/EmailCapture";
import { signIn } from "next-auth/react";

describe("<EmailCapture />", () => {
  it("affiche le label et le bouton", () => {
    render(<EmailCapture />);
    expect(
      screen.getByRole("textbox", { name: /connexion par email/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /recevoir le lien/i })
    ).toBeInTheDocument();
  });

  it("valide le champ et affiche l’erreur sur email vide", async () => {
    const user = userEvent.setup();
    render(<EmailCapture />);

    await user.click(screen.getByRole("button", { name: /recevoir le lien/i }));

    expect(
      screen.getByText(/l’email est requis|email invalide/i)
    ).toBeInTheDocument();
  });

  it("affiche une erreur sur email invalide", async () => {
    const user = userEvent.setup();
    render(<EmailCapture />);

    await user.type(
      screen.getByRole("textbox", { name: /connexion par email/i }),
      "not-an-email"
    );
    await user.click(screen.getByRole("button", { name: /recevoir le lien/i }));

    expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
  });

  it("appelle signIn et affiche le message de succès", async () => {
    const user = userEvent.setup();
    (signIn as unknown as vi.Mock).mockResolvedValue({
      ok: true,
      error: undefined,
      status: 200,
      url: null,
    });

    render(<EmailCapture />);

    await user.type(
      screen.getByRole("textbox", { name: /connexion par email/i }),
      "test@example.com"
    );
    await user.click(screen.getByRole("button", { name: /recevoir le lien/i }));

    expect(signIn).toHaveBeenCalledWith("resend", {
      email: "test@example.com",
      redirect: false,
      callbackUrl: "/dashboard",
    });

    expect(await screen.findByText(/email envoyé/i)).toBeInTheDocument();
  });
});
