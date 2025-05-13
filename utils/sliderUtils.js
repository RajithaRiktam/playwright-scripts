export async function moveSlider(page, sliderSelector, targetValue) {
    const slider = page.locator(sliderSelector);
    await slider.waitFor();

    let currentValue = await slider.evaluate(el => parseInt(el.value, 10));
    console.log(`Moving slider from ${currentValue} to ${targetValue}`);

    while (currentValue < targetValue) {
        await slider.press('ArrowRight');
        await page.waitForTimeout(100); // Small delay to simulate real interaction
        currentValue = await slider.evaluate(el => parseInt(el.value, 10));
       // console.log(`Current slider value: ${currentValue}`);
    }

    console.log(`Slider moved to ${targetValue} years`);
}