/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)
--------------------------------------------------------------------------------------*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Animation;

namespace OWLOSThingsManager.EcosystemExplorer.EcosystemControls
{
    /// <summary>
    /// Interaction logic for OWLOSLogPanelControl.xaml
    /// </summary>
    public partial class OWLOSLogPanelControl : UserControl
    {
        private int logCount = 0;
        private double saveY = 0;
        private bool atAnimation = false;

        public OWLOSLogPanelControl()
        {
            InitializeComponent();
        }

        public void AddToLog(string text, int code)
        {
            if (!string.IsNullOrEmpty(text))
            {
                List<string> lines = text.Split('\n').ToList();
                foreach (string line in lines)
                {
                    Add(line, code);
                }
            }
            else
            {
                Add("--> NULL line to log", 3);
            }
        }

        private void Add(string text, int code)
        {
         
            base.Dispatcher.Invoke(() =>
            {

                if (!string.IsNullOrEmpty(text))
                {
                    TextBlock textBlock = new TextBlock();               
                    logPanel.Children.Add(textBlock);
                    logCount++;
                    textBlock.Name = "text" + logCount.ToString();

                    if (!atAnimation)
                    {
                        atAnimation = true;
                        double EndY;
                        TextBlock prev = logPanel.Children[0] as TextBlock;
                        if (prev.ActualHeight != double.NaN)
                        {
                            if (prev.ActualHeight < 20)
                            {

                                EndY = -(logCount * prev.ActualHeight / 1.0f - logScrollView.ActualHeight);
                            }
                            else
                            {
                                EndY = -(logCount * prev.ActualHeight / 4.0f - logScrollView.ActualHeight);
                            }
                        }
                        else
                        {
                            EndY = -logCount * 15;
                        }

                        DoubleAnimation AnimationY = new DoubleAnimation(saveY, EndY, TimeSpan.FromSeconds(1));
                        AnimationY.Completed += AnimationY_Completed;
                        saveY = EndY;

                        TranslateTransform Transform = new TranslateTransform();
                        logPanel.RenderTransform = Transform;

                        Transform.BeginAnimation(TranslateTransform.YProperty, AnimationY);
                    }


                    ColorAnimation animation = new ColorAnimation
                    {
                        Duration = new Duration(TimeSpan.FromSeconds(10))
                    };

                    switch (code)
                    {
                        case 0:
                            animation.To = ((SolidColorBrush)App.Current.Resources["OWLOSSuccessAlpha4"]).Color;
                            textBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSSuccess"]).Color);
                            break;
                        case 1:
                            animation.To = ((SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha4"]).Color;
                            textBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
                            break;
                        case 3:
                            animation.To = ((SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha4"]).Color;
                            textBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSDanger"]).Color);
                            break;
                        default:
                            animation.To = ((SolidColorBrush)App.Current.Resources["OWLOSInfoAlpha4"]).Color;
                            textBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSLight"]).Color);
                            break;

                    }

                    textBlock.Foreground.BeginAnimation(SolidColorBrush.ColorProperty, animation);


                    //https://stackoverflow.com/questions/3430659/is-there-a-wpf-typewriter-effect
                    Storyboard story = new Storyboard
                    {
                        FillBehavior = FillBehavior.HoldEnd
                    };

                    StringAnimationUsingKeyFrames stringAnimationUsingKeyFrames = new StringAnimationUsingKeyFrames
                    {
                        Duration = new Duration(TimeSpan.FromSeconds(1))
                    };


                    string tempText = string.Empty;
                    text = DateTime.Now + " " + text;
                    foreach (char c in text)
                    {
                        DiscreteStringKeyFrame discreteStringKeyFrame = new DiscreteStringKeyFrame
                        {
                            KeyTime = KeyTime.Paced
                        };
                        tempText += c;
                        stringAnimationUsingKeyFrames.KeyFrames.Add(discreteStringKeyFrame);
                        if (tempText.Length < text.Length)
                        {
                            discreteStringKeyFrame.Value = tempText + "█";
                        }
                        else
                        {
                            discreteStringKeyFrame.Value = tempText;
                        }

                    }
                    Storyboard.SetTargetProperty(stringAnimationUsingKeyFrames, new PropertyPath(TextBlock.TextProperty));
                    story.Children.Add(stringAnimationUsingKeyFrames);

                    story.Begin(textBlock);
                }
            });
        }

        private void AnimationY_Completed(object sender, EventArgs e)
        {
            atAnimation = false;
        }


    }
}
