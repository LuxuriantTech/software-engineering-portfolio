# AI-assisted development

I used AI coding agents to map commands and event paths, implement bounded
components, review code and investigate failures. My work included stating the
community workflow, defining permission expectations, splitting tasks, reading
the resulting diff and deciding whether tests were sufficient.

For security-sensitive paths I used adversarial verification of generated
code. A generated implementation was not accepted just because it ran: role
failure, guild isolation and private-data handling had to be explicit.
