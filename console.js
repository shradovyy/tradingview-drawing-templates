async function fetchTemplates(toolNames, userId = "662b503306ee4c9a6c76b675") {
	const results = [];

	for (const toolName of toolNames) {
		try {
			// Step 1: Fetch the list of templates
			const templatesUrl = `https://www.tradingview.com/drawing-templates/${toolName}/`;
			const response = await fetch(templatesUrl);
			if (!response.ok) {
				throw new Error(`Failed to fetch templates: ${response.statusText}`);
			}

			const templates = await response.json();

			// Step 2: Loop through templates and fetch individual data
			const baseTemplateUrl = `https://www.tradingview.com/drawing-template/${toolName}/?templateName=`;
			for (const templateName of templates) {
				try {
					const encodedTemplateName = encodeURIComponent(templateName); // Ensure URL-safe template names
					const url = `${baseTemplateUrl}${encodedTemplateName}`;
					const templateResponse = await fetch(url);
					if (!templateResponse.ok) {
						console.error(`Failed to fetch data for template: ${templateName}`);
						continue;
					}
					const templateData = await templateResponse.json(); // Assuming the response is JSON

					results.push({
						name: templateName,
						user: {
							$oid: userId,
						},
						toolName: toolName,
						content: JSON.stringify(JSON.parse(templateData.content)),
					});
				} catch (error) {
					console.error(`Error fetching template ${templateName}:`, error);
				}
			}
		} catch (error) {
			console.error("Error in fetching templates:", error);
		}
	}

	console.log(results);
}


// check readme for other tools
fetchTemplates(["LineToolTrendLine", "LineToolRectangle", "LineToolFibRetracement"]);
