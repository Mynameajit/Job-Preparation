import jsPDF from "jspdf";

export const generateResumePDF = (data: any) => {
    const doc = new jsPDF();

    let y = 20;

    // ======================
    // NAME
    // ======================
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text(data.fullName.toUpperCase(), 105, y, { align: "center" });

    y += 8;

    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.text(data.heading || "", 105, y, { align: "center" });

    y += 8;

    // ======================
    // CONTACT
    // ======================
    doc.setFont("times", "normal");
    doc.setFontSize(10);

    const contact = `${data.email}   |   ${data.phone}   |   ${data.location}`;
    doc.text(contact, 105, y, { align: "center" });

    y += 6;

    const links = `${data.linkedin || ""}   ${data.github ? "| " + data.github : ""}`;
    doc.text(links, 105, y, { align: "center" });

    y += 8;

    doc.line(14, y, 196, y);
    y += 8;

    // ======================
    // PROFILE
    // ======================
    doc.setFont("times", "bold");
    doc.text("PROFILE", 14, y);

    y += 6;

    doc.setFont("times", "normal");

    const summaryLines = doc.splitTextToSize(data.summary || "", 180);
    doc.text(summaryLines, 14, y);

    y += summaryLines.length * 5 + 5;

    doc.line(14, y, 196, y);
    y += 8;

    // ======================
    // EDUCATION
    // ======================
    doc.setFont("times", "bold");
    doc.text("EDUCATION", 14, y);

    y += 6;

    data.education.forEach((edu: any) => {
        doc.setFont("times", "bold");

        doc.text(edu.degree, 14, y);

        doc.setFont("times", "normal");
        doc.text(`${edu.startDate} - ${edu.endDate}`, 196, y, { align: "right" });

        y += 5;

        doc.setFont("times", "italic");
        doc.text(edu.school, 14, y);

        doc.text(edu.location, 196, y, { align: "right" });

        y += 8;
    });

    doc.line(14, y, 196, y);
    y += 8;

    // ======================
    // SKILLS
    // ======================
    doc.setFont("times", "bold");
    doc.text("SKILLS", 14, y);

    y += 6;

    doc.setFont("times", "normal");

    const skillsLine = data.skills.join(", ");
    const skillWrap = doc.splitTextToSize(skillsLine, 180);

    doc.text(skillWrap, 14, y);

    y += skillWrap.length * 5 + 5;

    doc.line(14, y, 196, y);
    y += 8;

    // ======================
    // LANGUAGES
    // ======================
    if (data.languages?.length) {
        doc.setFont("times", "bold");
        doc.text("LANGUAGES", 14, y);

        y += 6;

        doc.setFont("times", "normal");

        data.languages.forEach((lang: any) => {
            doc.text(`${lang.name} - ${lang.level}`, 14, y);
            y += 5;
        });

        y += 3;
        doc.line(14, y, 196, y);
        y += 8;
    }

    // ======================
    // PROJECTS
    // ======================
    if (data.projects?.length) {
        doc.setFont("times", "bold");
        doc.text("PROJECTS", 14, y);

        y += 6;

        data.projects.forEach((p: any) => {
            doc.setFont("times", "bold");
            doc.text(p.title, 14, y);

            if (p.link) {
                doc.setTextColor(0, 0, 255);
                doc.text(p.link, 196, y, { align: "right" });
                doc.setTextColor(0, 0, 0);
            }

            y += 5;

            doc.setFont("times", "normal");
            const desc = doc.splitTextToSize(p.description, 180);
            doc.text(desc, 14, y);

            y += desc.length * 5 + 5;
        });
    }

    // ======================
    // SAVE
    // ======================
    doc.save("resume.pdf");
};